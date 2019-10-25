<?php

namespace App\Repositories;

class DeclaredWorkRepository extends BaseRepository
{
    protected function model()
    {
        return "App\Models\DeclaredWork";
    }
    
    public function getDeclaredWork($id, $closed = 0, $checked = false)
    {
        $declaredWork  = [];
        $model         = $this->getModel();
        $declaredWork  = $model->find($id);
        
        if ($declaredWork) {
            $orderPosition = $declaredWork->orderPosition; 
            $order         = $orderPosition->order;
            $product       = $declaredWork->product;
            $productType   = $product->type;
            $task          = $declaredWork->task;
            $taskGroup     = $task->group;

            $declaredWork->product_id        = $product->id;
            $declaredWork->product_name      = $product->name;
            $declaredWork->product_kod       = $product->kod;
            $declaredWork->product_type_name = $productType->name;
            $declaredWork->task_id           = $task->id;
            $declaredWork->task_name         = $task->name;
            $declaredWork->task_kod          = $task->kod;
            $declaredWork->order_name        = $order->name;
            $declaredWork->order_kod         = $order->kod;
            $declaredWork->order_description = $order->description;
            $declaredWork->position_kod      = $orderPosition->kod;
            $declaredWork->order_position_id = $orderPosition->id;
            $declaredWork->amount            = $orderPosition->amount;
            $date = new \DateTime($orderPosition->date_delivery);
            $declaredWork->num_week          = $date->format("W");
            $declaredWork->key               = $task->id;
            $declaredWork->label             = $task->name;
            $declaredWork->text              = $task->name;
            $declaredWork->value             = $task->id; 
            $declaredWork->closed            = $closed;
            $declaredWork->checked           = $checked;
            $declaredWork->damount = $model::where('kod', '=', $declaredWork->kod)
                    ->where('task_id', '=', $declaredWork->task->id)
                    ->sum('declared_amount'); 
        }
        
        return $declaredWork; 
    }
    
    /**
     * Gets list declared works by tasks ids.
     * 
     * @param array $tasksIds
     * @return array
     */
    public function getDeclaredWorksByTasksIds($tasksIds)
    {        
        $model    = $this->model();
        $declaredWorks = $model::whereIn('task_id', $tasksIds)
                ->orderBy('id', 'desc')
                //->selectRaw('*, sum(declared_amount) as damount')
                ->groupBy('kod', 'product_id', 'task_id')                    
                ->get();
        
        return $this->getResult($declaredWorks, 0, false);
    }
    
    /**
     * Gets list of all declared works 
     * 
     * @return array
     */    
    public function getAllDeclaredWorks()
    {
        $model = $this->model();
        $declaredWorks = $model::orderBy('id', 'desc')
                    ->orderBy('id', 'desc')
                    ->groupBy('kod', 'product_id', 'task_id')                    
                    ->get();
        
        return $this->getResult($declaredWorks, 0, false);
    }
    
    /**
     * Get list of declared works by order position id
     * 
     * @param int $positionId
     * @return array
     */
    public function getDeclaredWorksByOrderPosition($positionId) 
    {
        $model = $this->model();
        $declaredWorks = $model::where('order_position_id', '=', $positionId)->get(); 
        
        return $this->getResult($declaredWorks, 0, true);
    }
    
    /**
     * Gets list of declared works for zlecenie 
     * by id of one of works from zlecenie
     * 
     * @param int declared work id
     * @return array
     */    
    public function getDeclaredWorksByZlecenie($declaredWorkId)
    {
        $model = $this->model();
        $declaredWork  = $model::find($declaredWorkId); 
        $declaredWorks = $model::where("kod", "=", $declaredWork->kod)->get(); 
        
        return $this->getResult($declaredWorks, 0, true);
    }
    
    /**
     * Returns declared works kods by ids
     * 
     * @param array $worksIds
     * @retun array
     */
    public function getDeclaredWorksKodsByIds($worksIds)
    {
        $model = $this->model();
        return $model::find($worksIds)->pluck("kod");
    }
    
    /**
     * Returns declared works by kods
     * 
     * @param array $declaredWorksKods
     * @return array
     */
    public function getAllDeclaredWorksByKods($declaredWorksKods) 
    {
        $model = $this->model();
        return $model::whereIn("kod", $declaredWorksKods)->get();
    }
    
    /**
     * Returns list of all declared works for zlecenie 
     * by several works ids in that zlecenie.
     * That function is used in case when we have choosen several declared works 
     * for deleting in table where they are showing in grouping mode 
     * (general zlecenia for example).
     * 
     * @param array $worksIds
     * @return array
     */
    public function getAllDeclaredWorksInZlecenieBySeveralWorksIds($worksIds) 
    {
        $zleceniaCodes = $this->getDeclaredWorksKodsByIds($worksIds);
        return $this->getAllDeclaredWorksByKods($zleceniaCodes);  
    }
    
    public function getDeclaredWorksGroupByKod()
    {
        return $this->model::groupBy("kod")->get();
    }

    /**
     * Returns result array
     * 
     * @param array of objects $declaredWorks
     * @return array
     */
    public function getResult($declaredWorks, $closed, $checked)
    {
        $result = [];
        
        if ($declaredWorks) {
            foreach ($declaredWorks as $declaredWork) {
                $result[] = $this->
                        getDeclaredWork($declaredWork->id, $closed, $checked);    
            }        
        }
        
        return $result;   
    }
    
}
