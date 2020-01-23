<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\OrderPositionRepository;

use App\Models\OrderPosition;
use App\Models\DeclaredWork;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Component;

class OrderPositionController extends BaseController
{
    protected static $code39 = array(
        '0' => 'bwbwwwbbbwbbbwbw', '1' => 'bbbwbwwwbwbwbbbw',
        '2' => 'bwbbbwwwbwbwbbbw', '3' => 'bbbwbbbwwwbwbwbw',
        '4' => 'bwbwwwbbbwbwbbbw', '5' => 'bbbwbwwwbbbwbwbw',
        '6' => 'bwbbbwwwbbbwbwbw', '7' => 'bwbwwwbwbbbwbbbw',
        '8' => 'bbbwbwwwbwbbbwbw', '9' => 'bwbbbwwwbwbbbwbw',
        'A' => 'bbbwbwbwwwbwbbbw', 'B' => 'bwbbbwbwwwbwbbbw',
        'C' => 'bbbwbbbwbwwwbwbw', 'D' => 'bwbwbbbwwwbwbbbw',
        'E' => 'bbbwbwbbbwwwbwbw', 'F' => 'bwbbbwbbbwwwbwbw',
        'G' => 'bwbwbwwwbbbwbbbw', 'H' => 'bbbwbwbwwwbbbwbw',
        'I' => 'bwbbbwbwwwbbbwbw', 'J' => 'bwbwbbbwwwbbbwbw',
        'K' => 'bbbwbwbwbwwwbbbw', 'L' => 'bwbbbwbwbwwwbbbw',
        'M' => 'bbbwbbbwbwbwwwbw', 'N' => 'bwbwbbbwbwwwbbbw',
        'O' => 'bbbwbwbbbwbwwwbw', 'P' => 'bwbbbwbbbwbwwwbw',
        'Q' => 'bwbwbwbbbwwwbbbw', 'R' => 'bbbwbwbwbbbwwwbw',
        'S' => 'bwbbbwbwbbbwwwbw', 'T' => 'bwbwbbbwbbbwwwbw',
        'U' => 'bbbwwwbwbwbwbbbw', 'V' => 'bwwwbbbwbwbwbbbw',
        'W' => 'bbbwwwbbbwbwbwbw', 'X' => 'bwwwbwbbbwbwbbbw',
        'Y' => 'bbbwwwbwbbbwbwbw', 'Z' => 'bwwwbbbwbbbwbwbw',
        '-' => 'bwwwbwbwbbbwbbbw', '.' => 'bbbwwwbwbwbbbwbw',
        ' ' => 'bwwwbbbwbwbbbwbw', '*' => 'bwwwbwbbbwbbbwbw',
        '$' => 'bwwwbwwwbwwwbwbw', '/' => 'bwwwbwwwbwbwwwbw',
        '+' => 'bwwwbwbwwwbwwwbw', '%' => 'bwbwwwbwwwbwwwbw'
    );    
    
    protected $rep;

    public function __construct(OrderPositionRepository $rep)
    {
        parent:: __construct();
        $this->setRepository($rep);
    } 
    
    /**
     * Get orders positions list 
     * 
     * @return response
     */
    public function index()
    {
        $all = $this->repository->getAllWithAdditionals();
        
        if ($all) {
            return response()->json(['data' => $all, 'success' => true]); 
        } else {
            return response()->json(['data' => [], 'success' => false]);
        }  
    }  
    
    public function positionComponents($positionsIds, $locale="pl")
    {   
        $result = [];
        $result = DB::select(DB::raw("select if(c.component_id, c.component_id, op.product_id) as component_id, 
            sum(if(c.amount * op.amount, c.amount * op.amount, op.amount)) as amount1, 
            p.kod, op.id as order_position_id,
            (select sum(w.amount) from warehouse w where w.product_id = if(c.component_id, c.component_id, op.product_id)) as available
            from orders_positions op
            left join components c on op.product_id = c.product_id
            left join products p on p.id = if(c.component_id, c.component_id, op.product_id)
            where op.id in (" . $positionsIds .")
            group by if(c.component_id, c.component_id, op.product_id)"));
       
        return $this->getResponseResult($result);        
    }
    
    public function positionsTasks($positionsIds)
    {
        $result = [];
        $positions    = $this->repository->get(explode(',', $positionsIds));
        if ($positions) {
            foreach ($positions as $position) {
//                $tasks = $this->repository->getTasks($position->id);
                $product       = $position->product;
                $operations    = $position->operations;
                $tasks         = $product->tasks;
                if ($tasks) {                
                    foreach ($tasks as $task) { 
                        $task->amount      = $position->amount;
                        $task->duration    = $position->amount * $task->pivot->duration;
                        $task->key         = $task->id;
                        $task->task_id     = $task->id;
                        $task->label       = $task->name;
                        $task->done        = $operations->where("task_id", "=", $task->id)
                                ->sum("done_amount");
                        $task->countWorks  = $operations->where("task_id", "=", $task->id)
                                ->count("id");  
                        $task->status     = true;
                        $wasChangedTask   = DeclaredWork::where("order_position_id", "=", $position->id)
                            ->where("task_id", "=", $task->id)->get();
                        if (count($wasChangedTask)) {
                            //print_r($wasChangedTask);
                            $task->status   = $wasChangedTask[0]->status;
                            $task->amount   = $wasChangedTask[0]->declared_amount;
                            $task->duration = $wasChangedTask[0]->declared_amount * $task->pivot->duration;
                        }
                        $result[] = $task;
                    }                
                } 
            }            
        } else {
            return response()->json(['data' => $positions, 'success' => false, 
                'message' => 'positions not found']); 
        }                 
            
        return $this->getResponseResult($result);
    }       
    
    /**
     * Get list order positions marked as "for manufacturing"
     * 
     * @return response
     */    
    public function forManufacturing()
    {        
        return $this->getResponseResult($this->repository->getForManufacturingPositions());        
    }   
    
    /**
     * Get list order positions which have tasks and can be manufactured
     * 
     * @return response
     */    
    public function forZlecenia()
    {    
        $productsWithTasks = Product::has("tasks")->pluck("id");
        $positionsIds = OrderPosition::whereIn("product_id", $productsWithTasks)
                ->pluck("id");
        
        return $this->getResponseResult($this->repository->getFewWithAdditionals($positionsIds));        
    }      
    
    /**
     * create new order position
     */
    public function store(Request $request)
    {     
        $orderPosition = [];
        $order = [];
        $currentWeekNum = date("W");
        $currentYear    = date("Y");
        if ($request['num_week'] < $currentWeekNum) {
            $year = $currentYear + 1; 
        } else {
            $year = $currentYear;
        }
        
        $date = new \DateTime;
        $date_end = $date->setISODate($year, $request['num_week'])->format('Y-m-d');

        $order = \App\Models\Order::find($request->order_id);
        if ($order) {
            $orderPosition                = new OrderPosition();
            $orderPosition->kod           = $order->kod . "." . $request->kod;   
            $orderPosition->order_id      = $request['order_id']; 
            $orderPosition->product_id    = $request['product_id'];
            $orderPosition->amount        = $request['amount'];
            $orderPosition->price         = $request['price'];
            $orderPosition->description   = $request['description'];
            $orderPosition->date_delivery = $date_end;

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
    
    /**
     * Gets list of components for product in order position
     * 
     * @param int $orderPosition
     * @return json response
     */
//    public function listComponentsForPosition($orderPosition)
//    {
//        $result  = [];
//        $success = false;
//        
//        $position = OrderPosition::find($orderPosition);
//        if ($position) {
//            $product    = $position->product;
//            $components = $product->components;
//            if ($components) {
//                $success = true;                
//                foreach ($components as $component) {                    
//                    $componentProduct                      = $component->product;
//                    $neededAvailableOfComponent            = $component->amount * $position->amount;
//                    $availableAmountOfComponentInWarehouse = Warehouse::where('product_id', '=', $componentProduct->id)
//                                        ->sum('amount');                    
//                    $component['component_id']     = $componentProduct->id;
//                    $component['component_kod']    = $componentProduct->kod;
//                    $component['component_name']   = $componentProduct->name;
//                    $component['amount_need']      = $neededAvailableOfComponent;
//                    $component['amount_available'] = $availableAmountOfComponentInWarehouse;
//                    $component['available']        = 1;
//                    $component['zlecenie']         = "";
//                    if ($neededAvailableOfComponent > $availableAmountOfComponentInWarehouse) {
//                        $component['available'] = 0;
//                        $inProgress = DeclaredWork::where("product_id", "=", $componentProduct->id)
//                                ->where("order_position_id", "=", $position->id)
//                                ->distinct("kod")
//                                ->pluck("kod");
//                        if (count($inProgress)) {
//                            $component['available'] = 2;
//                            $component['zlecenie']  = $inProgress[0];
//                        }
//                    }                  
//                }
//                $result = $components;
//            }
//        }   
//        
//        return response()->json(['data' => $result, 'success' => $success]);        
//    }
    
    public function listTasksForPosition($orderPosition)
    {
        $position = OrderPosition::find($orderPosition);
        //$order    = $position->order;
        $product  = $position->product;
        $tasks    = $product->tasks;
        
        if ($tasks) {
            foreach ($tasks as $task) {
                $task->text  = $task->name;
                $task->value = $task->id;
//                $res->task_id           = $res->id;
//                $res->order_kod         = $order->kod;
//                $res->order_position_id = $position->id;
//                $res->position_kod      = $position->kod;
//                $res->product_id        = $product->id;
//                $res->product_kod       = $product->kod;
//                $res->product_name      = $product->name;
//                $res->declared_amount   = $position->amount;
//                $res->checked           = true;
                $task->duration = $task->pivot->duration;
                $task->priority = $task->pivot->priority;
            }
            return response()->json(["success" => true, "data" => $tasks]);                
        } else {
            return response()->json(["success" => false, "data" => []]);                
        }         
    } 
    
//    public function listTasksForPositionComponent(Request $request)
//    {
//        $result = [];
//        
//        $position         = OrderPosition::find($request['position_id']);
//        $componentProduct = Product::find($request['component_id']);            
//        $tasks            = $componentProduct->tasks;        
//        if ($tasks) {
//            foreach ($tasks as $task) {
//                $task['order_kod']         = $position->order->kod; 
//                $task['task_id']           = $task->id;                
//                $task['position_kod']      = $position->kod;
//                $task['product_name']      = $componentProduct->name;
//                $task['product_kod']       = $componentProduct->kod; 
//                $task['product_id']        = $componentProduct->id; 
//                $task['order_position_id'] = $position->id;
//                $task['declared_amount']   = $request['amount'];
//                $task['checked'] = true;
//            }            
//            $result = $tasks;
//        }                
//                
//        return response()->json(["success" => (boolean)count($result), "data" => $result]);                
//    }       
    
    public function edit(Request $request, $id)
    {       
        $currentWeekNum = date("W");
        $currentYear    = date("Y");
        if ($request['num_week'] < $currentWeekNum) {
            $year = $currentYear + 1; 
        } else {
            $year = $currentYear;
        }
        
        $date = new \DateTime;
        $date_end = $date->setISODate($year, $request['num_week'])->format('Y-m-d');
        
        $orderPosition                = OrderPosition::find($id);
        $orderPosition->kod           = $request['kod'];
        $orderPosition->order_id      = $request['order_id'];
        $orderPosition->product_id    = $request['product_id'];
        $orderPosition->amount        = $request['amount'];
        $orderPosition->price         = $request['price'];
        $orderPosition->description   = $request['description'];
        $orderPosition->date_delivery = $date_end;
        $orderPosition->status        = $request['status'];
        $orderPosition->date_status   = $request['date_status'];
        
        if ($orderPosition->save()) {
            return response()->json(['data' => $this->repository->getWithAdditionals($orderPosition->id),
                'success' => true]);
        } else {
            return response()->json(['data' => [], 'success' => false, 
                'message' => 'Saving new position failed']);
        }
    }
    
    public function getPositionsByOrder($orderId)
    {    
        $positions = $this->repository->getFewWithAdditionals(OrderPosition::where("order_id", "=", $orderId)->pluck("id"));
        
        if ($positions) {
            return response()->json(['data' => $positions, 'success' => true]);  
        } else {
            return response()->json(['data' => $positions, 'success' => false, 
                'message' => 'Failed']);             
        }      
    }
    
    public function print($positionsIds)
    {         
        $head = '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns:m="http://schemas.microsoft.com/office/2004/12/omml" xmlns="http://www.w3.org/TR/REC-html40">

            <head>
            <meta http-equiv=Content-Type content="text/html; charset=unicode">
            <meta name=ProgId content=Word.Document>
            <meta name=Generator content="Microsoft Word 15">
            <meta name=Originator content="Microsoft Word 15">
            <link rel=File-List href="obiegowka2_pliki/filelist.xml">
            <!--[if gte mso 9]><xml>
            <o:DocumentProperties>
            <o:Author>Pawel</o:Author>
            <o:LastAuthor>Pawel</o:LastAuthor>
            <o:Revision>2</o:Revision>
            <o:TotalTime>14</o:TotalTime>
            <o:Created>2018-08-05T19:18:00Z</o:Created>
            <o:LastSaved>2018-08-05T19:18:00Z</o:LastSaved>
            <o:Pages>1</o:Pages>
            <o:Words>70</o:Words>
            <o:Characters>421</o:Characters>
            <o:Lines>3</o:Lines>
            <o:Paragraphs>1</o:Paragraphs>
            <o:CharactersWithSpaces>490</o:CharactersWithSpaces>
            <o:Version>15.00</o:Version>
            </o:DocumentProperties>
            </xml><![endif]-->
            <link rel=themeData href="obiegowka2_pliki/themedata.thmx">
            <link rel=colorSchemeMapping href="obiegowka2_pliki/colorschememapping.xml">
            <style>
              < !--
              /* Font Definitions */

              @font-face {
                font-family: "Cambria Math";
                panose-1: 2 4 5 3 5 4 6 3 2 4;
                mso-font-charset: 238;
                mso-generic-font-family: roman;
                mso-font-pitch: variable;
                mso-font-signature: -536869121 1107305727 33554432 0 415 0;
              }

              @font-face {
                font-family: Calibri;
                panose-1: 2 15 5 2 2 2 4 3 2 4;
                mso-font-charset: 238;
                mso-generic-font-family: swiss;
                mso-font-pitch: variable;
                mso-font-signature: -536859905 -1073732485 9 0 511 0;
              }

              /* Style Definitions */

              p.MsoNormal,
              li.MsoNormal,
              div.MsoNormal {
                mso-style-unhide: no;
                mso-style-qformat: yes;
                mso-style-parent: "";
                margin: 0cm;
                margin-bottom: .0001pt;
                mso-pagination: widow-orphan;
                font-size: 12.0pt;
                font-family: "Times New Roman", serif;
                mso-fareast-font-family: "Times New Roman";
                mso-fareast-theme-font: minor-fareast;
              }

              h3 {
                mso-style-priority: 9;
                mso-style-unhide: no;
                mso-style-qformat: yes;
                mso-style-link: "Nagłówek 3 Znak";
                margin: 0cm;
                margin-bottom: .0001pt;
                text-align: center;
                mso-pagination: widow-orphan;
                page-break-after: avoid;
                mso-outline-level: 3;
                font-size: 12.0pt;
                font-family: "Arial", sans-serif;
                mso-fareast-font-family: "Times New Roman";
                mso-fareast-theme-font: minor-fareast;
                color: navy;
                font-weight: normal;
                font-style: italic;
              }

              span.Nagwek3Znak {
                mso-style-name: "Nagłówek 3 Znak";
                mso-style-noshow: yes;
                mso-style-priority: 9;
                mso-style-unhide: no;
                mso-style-locked: yes;
                mso-style-link: "Nagłówek 3";
                font-family: "Arial", sans-serif;
                mso-ascii-font-family: Arial;
                mso-hansi-font-family: Arial;
                mso-bidi-font-family: Arial;
                color: navy;
                font-style: italic;
              }

              p.msopapdefault,
              li.msopapdefault,
              div.msopapdefault {
                mso-style-name: msopapdefault;
                mso-style-unhide: no;
                mso-margin-top-alt: auto;
                margin-right: 0cm;
                margin-bottom: 10.0pt;
                margin-left: 0cm;
                line-height: 115%;
                mso-pagination: widow-orphan;
                font-size: 12.0pt;
                font-family: "Times New Roman", serif;
                mso-fareast-font-family: "Times New Roman";
                mso-fareast-theme-font: minor-fareast;
              }

              span.SpellE {
                mso-style-name: "";
                mso-spl-e: yes;
              }

              .MsoChpDefault {
                mso-style-type: export-only;
                mso-default-props: yes;
                font-size: 10.0pt;
                mso-ansi-font-size: 10.0pt;
                mso-bidi-font-size: 10.0pt;
              }

              .MsoPapDefault {
                mso-style-type: export-only;
                margin-bottom: 10.0pt;
                line-height: 115%;
              }

              @page WordSection1 {
                size: 595.3pt 841.9pt;
                margin: 42.55pt 14.2pt 14.2pt 14.2pt;
                mso-header-margin: 35.4pt;
                mso-footer-margin: 35.4pt;
                mso-paper-source: 0;
              }

              div.WordSection1 {
                page: WordSection1;
              }

              -->
            </style>
            <!--[if gte mso 10]>
            <style>
            /* Style Definitions */
            table.MsoNormalTable
              {mso-style-name:Standardowy;
              mso-tstyle-rowband-size:0;
              mso-tstyle-colband-size:0;
              mso-style-noshow:yes;
              mso-style-priority:99;
              mso-style-parent:"";
              mso-padding-alt:0cm 5.4pt 0cm 5.4pt;
              mso-para-margin-top:0cm;
              mso-para-margin-right:0cm;
              mso-para-margin-bottom:10.0pt;
              mso-para-margin-left:0cm;
              line-height:115%;
              mso-pagination:widow-orphan;
              font-size:10.0pt;
              font-family:"Times New Roman",serif;}
            </style>
            <![endif]-->
            <!--[if gte mso 9]><xml>
            <o:shapedefaults v:ext="edit" spidmax="1026"/>
            </xml><![endif]-->
            <!--[if gte mso 9]><xml>
            <o:shapelayout v:ext="edit">
            <o:idmap v:ext="edit" data="1"/>
            </o:shapelayout></xml><![endif]-->
            </head>
            <body lang=PL style=\'tab-interval:35.4pt\' onload="print();">
                <div class=WordSection1>
                    <div align=center>';
        $obiegowka='
            <table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 width=0 style=\'width:474.9pt;border-collapse:collapse;mso-yfti-tbllook:1184; mso-padding-alt:0cm 3.5pt 0cm 3.5pt\'>
            <tr style=\'mso-yfti-irow:0;mso-yfti-firstrow:yes;height:34.25pt\'>
              <td width=633 nowrap colspan=3 style=\'width:474.9pt;border:none;border-bottom:  solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .5pt;  padding:0cm 3.5pt 0cm 3.5pt;height:35.25pt\'>
                <p class=MsoNormal align=center style=\'text-align:center\'>
                  <b style=\'mso-bidi-font-weight:normal\'>
                    <span style=\'font-family:"Calibri",sans-serif;   mso-fareast-font-family:"Times New Roman";color:black\'>|kod|
                      <o:p></o:p>
                    </span>
                  </b>
                </p>
              </td>
              <![if !supportMisalignedRows]>
              <td style=\'height:35.25pt;border:none\' width=0 height=47></td>
              <![endif]>
            </tr>
            <tr style=\'mso-yfti-irow:1;height:34.25pt\'>
              <td width=633 nowrap colspan=3 style=\'width:474.9pt;border-top:none;  border-left:solid windowtext 1.0pt;border-bottom:solid windowtext 1.0pt; border-right:solid black 1.0pt;mso-border-top-alt:solid windowtext .5pt;  mso-border-alt:solid windowtext .5pt;mso-border-right-alt:solid black .5pt;  padding:0cm 3.5pt 0cm 3.5pt;height:35.25pt\'>
                <p class=MsoNormal>
                  <span style=\'font-family:"Calibri",sans-serif;mso-fareast-font-family:  "Times New Roman";color:black\'>STANOWISKO ROBOCZE:
                    <span style=\'mso-spacerun:yes\'>  </span>{obszar}
                    <o:p></o:p>
                  </span>
                </p>
              </td>
              <![if !supportMisalignedRows]>
              <td style=\'height:35.25pt;border:none\' width=0 height=47></td>
              <![endif]>
            </tr>
            <tr style=\'mso-yfti-irow:2;height:13.7pt\'>
              <td width=255 nowrap style=\'width:191.4pt;border-top:none;border-left:solid windowtext 1.0pt;  border-bottom:solid windowtext 1.0pt;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;  mso-border-right-alt:solid black .5pt;padding:0cm 3.5pt 0cm 3.5pt;height:  13.7pt\'>
                <p class=MsoNormal>
                  <span style=\'font-family:"Calibri",sans-serif;mso-fareast-font-family:  "Times New Roman";color:black\'>NR ZLECENIA
                    <o:p></o:p>
                  </span>
                </p>
              </td>
              <td width=227 nowrap style=\'width:6.0cm;border-top:none;border-left:none;  border-bottom:solid windowtext 1.0pt;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:solid windowtext .5pt;  mso-border-bottom-alt:solid windowtext .5pt;mso-border-right-alt:solid black .5pt;  padding:0cm 3.5pt 0cm 3.5pt;height:13.7pt\'>
                <p class=MsoNormal>
                  <span style=\'font-family:"Calibri",sans-serif;mso-fareast-font-family:  "Times New Roman";color:black\'>KOD PRODUKTU
                    <o:p></o:p>
                  </span>
                </p>
              </td>
              <td width=151 nowrap style=\'width:4.0cm;border-top:none;border-left:none;  border-bottom:solid windowtext 1.0pt;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:solid windowtext .5pt;  mso-border-bottom-alt:solid windowtext .5pt;mso-border-right-alt:solid black .5pt;  padding:0cm 3.5pt 0cm 3.5pt;height:13.7pt\'>
                <p class=MsoNormal>
                  <span style=\'font-family:"Calibri",sans-serif;mso-fareast-font-family:  "Times New Roman";color:black\'>DATA WYSTAWIENIA
                    <o:p></o:p>
                  </span>
                </p>
              </td>
              <![if !supportMisalignedRows]>
              <td style=\'height:13.7pt;border:none\' width=0 height=18></td>
              <![endif]>
            </tr>
            <tr style=\'mso-yfti-irow:3;height:34.25pt\'>
              <td width=255 nowrap style=\'width:191.4pt;border-top:none;border-left:solid windowtext 1.0pt;  border-bottom:solid windowtext 1.0pt;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;  mso-border-right-alt:solid black .5pt;padding:0cm 3.5pt 0cm 3.5pt;height:  35.25pt\'>
                <p class=MsoNormal align=center style=\'text-align:center\'>
                  <b style=\'mso-bidi-font-weight:normal\'>
                    <span style=\'font-family:"Calibri",sans-serif;  mso-fareast-font-family:"Times New Roman";color:black\'>{kod}
                      <o:p></o:p>
                    </span>
                  </b>
                </p>
              </td>
              <td width=227 nowrap style=\'width:6.0cm;border-top:none;border-left:none;  border-bottom:solid windowtext 1.0pt;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:solid windowtext .5pt;  mso-border-bottom-alt:solid windowtext .5pt;mso-border-right-alt:solid black .5pt;  padding:0cm 3.5pt 0cm 3.5pt;height:35.25pt\'>
                <p class=MsoNormal align=center style=\'text-align:center\'>
                  <b style=\'mso-bidi-font-weight:normal\'>
                    <span style=\'font-family:"Calibri",sans-serif;  mso-fareast-font-family:"Times New Roman";color:black\'>{material}
                      <o:p></o:p>
                    </span>
                  </b>
                </p>
              </td>
              <td width=151 nowrap style=\'width:4.0cm;border-top:none;border-left:none;  border-bottom:solid windowtext 1.0pt;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:solid windowtext .5pt;  mso-border-bottom-alt:solid windowtext .5pt;mso-border-right-alt:solid black .5pt;  padding:0cm 3.5pt 0cm 3.5pt;height:35.25pt\'>
                <p class=MsoNormal align=center style=\'text-align:center\'>
                  <b style=\'mso-bidi-font-weight:normal\'>
                    <span style=\'font-family:"Calibri",sans-serif;  mso-fareast-font-family:"Times New Roman";color:black\'>{dzisiaj}
                      <o:p></o:p>
                    </span>
                  </b>
                </p>
              </td>
              <![if !supportMisalignedRows]>
              <td style=\'height:35.25pt;border:none\' width=0 height=47></td>
              <![endif]>
            </tr>
            <tr style=\'mso-yfti-irow:4;height:13.7pt\'>
              <td width=482 nowrap colspan=2 style=\'width:361.5pt;border-top:none;  border-left:solid windowtext 1.0pt;border-bottom:none;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:solid windowtext .5pt;  mso-border-left-alt:solid windowtext .5pt;mso-border-right-alt:solid black .5pt;  padding:0cm 3.5pt 0cm 3.5pt;height:13.7pt\'>
                <p class=MsoNormal>
                  <span style=\'font-family:"Calibri",sans-serif;mso-fareast-font-family:  "Times New Roman";color:black\'>NAZWA PRODUKTU
                    <o:p></o:p>
                  </span>
                </p>
              </td>
              <td width=151 nowrap style=\'width:4.0cm;border-top:none;border-left:none;  border-bottom:solid windowtext 1.0pt;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:solid windowtext .5pt;  mso-border-bottom-alt:solid windowtext .5pt;mso-border-right-alt:solid black .5pt;  padding:0cm 3.5pt 0cm 3.5pt;height:13.7pt\'>
                <p class=MsoNormal align=center style=\'text-align:center\'>
                  <span style=\'font-family:"Calibri",sans-serif;mso-fareast-font-family:"Times New Roman";  color:black\'>ILOŚĆ
                    <o:p></o:p>
                  </span>
                </p>
              </td>
              <![if !supportMisalignedRows]>
              <td style=\'height:13.7pt;border:none\' width=0 height=18></td>
              <![endif]>
            </tr>
            <tr style=\'mso-yfti-irow:5;height:35.25pt\'>
              <td width=482 nowrap colspan=2 style=\'width:361.5pt;border-top:solid windowtext 1.0pt;  border-left:solid windowtext 1.0pt;border-bottom:none;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;  mso-border-right-alt:solid black .5pt;padding:0cm 3.5pt 0cm 3.5pt;height:  35.25pt\'>
                <p class=MsoNormal align=center style=\'text-align:center\'>
                  <b style=\'mso-bidi-font-weight:normal\'>
                    <span style=\'font-family:"Calibri",sans-serif;  mso-fareast-font-family:"Times New Roman";color:black\'>{zlecenie}
                      <o:p></o:p>
                    </span>
                  </b>
                </p>
              </td>
              <td width=151 nowrap style=\'width:4.0cm;border-top:none;border-left:none;  border-bottom:solid windowtext 1.0pt;border-right:solid black 1.0pt;  mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:solid windowtext .5pt;  mso-border-bottom-alt:solid windowtext .5pt;mso-border-right-alt:solid black .5pt;  padding:0cm 3.5pt 0cm 3.5pt;height:35.25pt\'>
                <p class=MsoNormal align=center style=\'text-align:center\'>
                  <b style=\'mso-bidi-font-weight:normal\'>
                    <span style=\'font-family:"Calibri",sans-serif;  mso-fareast-font-family:"Times New Roman";color:black\'>{szt}
                      <o:p></o:p>
                    </span>
                  </b>
                </p>
              </td>
              <![if !supportMisalignedRows]>
              <td style=\'height:35.25pt;border:none\' width=0 height=47></td>
              <![endif]>
            </tr>
            <tr style=\'mso-yfti-irow:6;height:30.25pt\'>
              <td width=633 nowrap colspan=3 rowspan=1 valign=top style=\'width:474.9pt;  border:solid windowtext 1.0pt;border-right:solid black 1.0pt;mso-border-alt:  solid windowtext .5pt;mso-border-right-alt:solid black .5pt;padding:0cm 3.5pt 0cm 3.5pt;  height:30.25pt\'>
                <p class=MsoNormal>
                  <span style=\'font-family:"Calibri",sans-serif;mso-fareast-font-family:  "Times New Roman";color:black\'>UWAGI:
                    <o:p>{uwagi}</o:p>
                  </span>
                </p>
              </td>
              <![if !supportMisalignedRows]>
              <td style=\'height:30.25pt;border:none\' width=0 height=40></td>
              <![endif]>
            </tr>
            <tr style=\'mso-yfti-irow:7;height:26.85pt\'>
              <span style=\'font-size:12.0pt;font-family:"Calibri",sans-serif;mso-fareast-font-family:  "Times New Roman";color:black;mso-ansi-language:PL;mso-fareast-language:PL;  mso-bidi-language:AR-SA\'>
                <![if !supportMisalignedRows]>
                <td style=\'height:26.85pt;border:none\' width=0 height=36></td>
                <![endif]>
              </span>
            </tr>
            <tr style=\'mso-yfti-irow:8;height:26.85pt\'>
              <td width=633 colspan=3 style=\'width:474.9pt;border:none;mso-border-top-alt:  solid windowtext .5pt;padding:0cm 3.5pt 0cm 3.5pt;height:26.85pt\'>
                <p class=MsoNormal>
                  <span style=\'font-family:"Calibri",sans-serif;mso-fareast-font-family:  "Times New Roman";color:black\'>
                    <o:p>&nbsp;</o:p>
                  </span>
                </p>
              </td>
              <![if !supportMisalignedRows]>
              <td style=\'height:26.85pt;border:none\' width=0 height=36></td>
              <![endif]>
            </tr>
            </table>
            ';
        $foot = '</div></div></body></html>';     
                
        $printedStatus = 1;
        $positions = $this->changeStatus($positionsIds, $printedStatus);
        $today = date('Y-m-d');
        $allTasks = '';        
        if (count($positions)) {            
            foreach ($positions as $position) {   
                $copyAmount = 3;
                $clientId = $position->order->client->id;
                if ($clientId) {
                    $copyAmount = 6;
                }
                //$tasks = $position->product->tasks;
                for ($i = 1; $i <= $copyAmount; $i++) {
                    $current = $obiegowka;
                    $barcode = $this->code39($position->id);
                    $current = str_replace('{dzisiaj}', $today, $current);
                    $current = str_replace('{zlecenie}', $position->product->name, $current);
                    $current = str_replace('{szt}', $position->amount, $current);
                    $current = str_replace('{material}', $position->product->kod, $current);
                    $current = str_replace('{kod}', $position->kod, $current);
                    $current = str_replace('|kod|', $barcode, $current);
                    $current = str_replace('{uwagi}', $position->description, $current);                
                    $current = str_replace('{obszar}', $i, $current);
                    $allTasks = $allTasks . $current;                    
                }          
            }   
           
            return $head . $allTasks . $foot;   
        }
        
        //return $head . $obiegowka . $foot;

        
//        $positions = $this->repository->get(explode(",", $positionsIds));
//         
//        if ($positions) {
//            foreach ($positions as $position) {
//                $position->status      = 1;
//                $position->date_status = date("Y-m-d H:i:s");
//                $position->save();
//            }
//            return response()->json(['data' => $positions, 'success' => true]);
//        } else {
//            return response()->json(['data' => $positions, 'success' => false, 
//                'message' => 'positions not found']);
//        }              
    }   
    
    public function changeStatus($positionsIds, $status)
    {              
        $positions = $this->repository->get(explode(",", $positionsIds));
         
        if ($positions) {
            foreach ($positions as $position) {
                $position->status      = $status;
                $position->date_status = date("Y-m-d H:i:s");
                $position->save();
            }          
        }  
        
        return $positions;
    }    
    
    public function code39($text) 
    {
        if (!preg_match('/^[A-Z0-9-. $+\/%]+$/i', $text)) {
            throw new Exception('Error');
        }

        $text = '*'.strtoupper($text).'*';
        $length = strlen($text);
        $chars = str_split($text);
        $colors = '';

        foreach ($chars as $char) {
            $colors .= self::$code39[$char];
        }

        $html = '<div style="float:left;"><div>';

        foreach (str_split($colors) as $i => $color) {
          if ($color=='b') {
            $html.='<SPAN style="BORDER-LEFT: 0.02in solid; DISPLAY: inline-block; HEIGHT: 0.4in;"></SPAN>';
          } else {
            $html.='<SPAN style="BORDER-LEFT: white 0.02in solid; DISPLAY: inline-block; HEIGHT: 0.4in;"></SPAN>';
          }
        }

        //$html.='</div><div style="float:left; width:100%;" align=center >'.$text.'</div></div>';

        return $html;
    }
}
