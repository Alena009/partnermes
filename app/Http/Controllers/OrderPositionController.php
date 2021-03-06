<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\OrderPositionRepository;
use App\Models\OrderPosition;
use Illuminate\Support\Facades\DB;
use App\Services\OrderPositionService;

class OrderPositionController extends BaseController
{    
    
    protected $rep;
    protected $srv;

    public function __construct(OrderPositionRepository $rep, OrderPositionService $srv)
    {
        parent:: __construct();
        $this->setRepository($rep);
        $this->setService($srv);
    }       
    
    public function positionComponents($positionsIds, $locale="pl")
    {   
        $result = [];

        $result = DB::select(DB::raw("select c.component_id as component_id, 
            sum(c.amount * op.amount) as amount1, 
            p.kod, GROUP_CONCAT(DISTINCT op.id SEPARATOR ',') as order_position_id,
            (select sum(w.amount) from warehouse w where w.product_id = c.component_id) as available,
            (select sum(op.amount) from orders_positions op 
                   where op.product_id = c.component_id and (op.status <> 3 or op.status is null)) as in_product
            from orders_positions op
            right join components c on op.product_id = c.product_id
            left join products p on p.id = c.component_id
            where op.id in (" . $positionsIds .")
            group by c.component_id"));           
        
        return $this->getResponse($result);        
    }
    
    public function positionsTasks($positionsIds)
    {
        $result = [];
        $positions    = $this->repository->get(explode(',', $positionsIds));
        if ($positions) {
            foreach ($positions as $position) {
                $product    = $position->product;
                $operations = $position->operations;
                $tasks      = $product->allTasks()->unique('id');
                if ($tasks) {                
                    foreach ($tasks as $task) { 
                        $task->amount      = $position->amount;
                        $task->duration    = $position->amount * $task->pivot->duration;
                        $task->key         = $task->id;
                        $task->value       = $task->id;
                        $task->text        = $task->name;
                        $task->task_id     = $task->id;
                        $task->label       = $task->name;
                        $task->priority    = $task->pivot->priority;
                        $task->done        = $operations->where("task_id", "=", $task->id)
                                ->sum("done_amount");
                        $task->countWorks  = $operations->where("task_id", "=", $task->id)
                                ->count("id");  
                        $result[] = $task;
                    }                
                } 
            }            
        } else {
            return response()->json(['data' => $positions, 'success' => false, 
                'message' => 'positions not found']); 
        }                 
            
        return $this->getResponse($result);
    }       
    
    /**
     * Get list printed positions
     * 
     * @return response
     */    
    public function getPrinted()
    {    
        $result = $this->repository->getPrintedPositions();
        return $this->getResponse($result, '', 'No printed tasks');                     
    }   
    
    /**
     * Get list order positions which have tasks and can be manufactured
     * 
     * @return response
     */    
    public function getZlecenia()
    {    
        $result = $this->repository->getPositionsWithTasks();
        return $this->getResponse($result, '', 'No positions with tasks');                             
    }      
    
    /**
     * create new order position
     */
    public function store(Request $request, $locale = 'pl')
    {     
        $orderPosition = [];
        $order = [];
        
        $order = \App\Models\Order::find($request->order_id);
        if ($order) {
            $orderPosition                = new OrderPosition();
            $orderPosition->kod           = $order->kod . "." . $request->kod;   
            $orderPosition->order_id      = $request['order_id']; 
            $orderPosition->product_id    = $request['product_id'];
            $orderPosition->amount        = $request['amount'];
            $orderPosition->price         = $request['price'];
            $orderPosition->description   = $request['description'];
            $orderPosition->date_delivery = $this->repository->getDate($request['num_week']);
            $orderPosition->status        = 1;            

            if ($orderPosition->save()) {               
                return response()->json(['data' => $this->repository->getWithAdditionals($orderPosition->id),
                    'success' => true]);
            } else {
                return response()->json(['data' => [], 'success' => false, 
                    'message' => 'Saving new position failed']);
            }  
        } else {
                return response()->json(['data' => [], 'success' => false, 
                    'message' => 'Saving new position failed. Order was not found']);
        }
    }      
    
    public function edit(Request $request, $id, $locale = 'pl')
    {  
        $orderPosition = [];
        $orderPosition = OrderPosition::find($id);
        
        if ($orderPosition) {
            $order = $orderPosition->order;             
            $orderPosition->kod           = $request->kod;  
            $orderPosition->order_id      = $request['order_id'];
            $orderPosition->product_id    = $request['product_id'];
            $orderPosition->amount        = $request['amount'];
            $orderPosition->price         = $request['price'];
            $orderPosition->description   = $request['description'];
            $orderPosition->date_delivery = $this->repository->getDate($request['num_week']);
            $orderPosition->status        = $request['status'];
            $orderPosition->date_status   = $request['date_status'];

            if ($orderPosition->save()) {
                return response()->json(['data' => $this->repository->getWithAdditionals($orderPosition->id),
                    'success' => true]);
            } else {
                return response()->json(['data' => [], 'success' => false, 
                    'message' => 'Saving new position failed']);
            }
        } else {
            return response()->json(['data' => [], 'success' => false, 
                'message' => 'Order position not found']);            
        }        
    }
    
    public function getPositionsByOrder($orderId)
    {    
        $positions = $this->repository->getFewWithAdditionals(OrderPosition::where("order_id", "=", $orderId)->pluck("id"));
        return $this->getResponse($positions, '', 'Failed');       
    }
    
    
    /**
     * Set positions like new
     * 
     * @param string $positionsIds
     * @return json
     */
    public function dontProduct($positionsIds)
    {
        $positions = $this->repository->get(explode(',', $positionsIds));  
        $result = $this->srv->dontProductPositions($positions);
        return $this->getResponse($result, '', 'Positions was not found');   
    }    
    
    /**
     * Closing positions. 
     * 
     * @param string $positionsIds
     * @return array of closed positions
     */
    public function close($positionsIds)
    {
        $positions = $this->repository->get(explode(',', $positionsIds));  
        $result = $this->srv->closePositions($positions);
        return $this->getResponse($result, '', 'Positions was not found'); 
    }
    
    /**
     * Reopening positions. 
     * 
     * @param string $positionsIds
     * @return array of closed positions
     */
    public function reOpen($positionsIds)
    {
        $positions = $this->repository->get(explode(',', $positionsIds)); 
        $result = $this->srv->reOpenPositions($positions);
        return $this->getResponse($result, '', 'Positions was not found');
    }    
    
    /**
     * Print positions by its ids
     * 
     * @param string $positionsIds
     * @return boolean
     */
    public function print($positionsIds, $locale = 'pl')
    {                        
        $positions = $this->repository->get(explode(',', $positionsIds));
        return $this->srv->printPositions($positions, $locale);                     
    }       
}
