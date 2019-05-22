<?php

namespace App\Repositories\Traits;

use Request;

trait FilterTrait
{
    private $filters = [];
    private $appliedFilters = [];
    protected $searchableColumns = [];

    /**
     * Dodaje filtr
     * $this->pushFilter('column = :column', ['column'=>$value])
     */
     public function pushFilter($sql, array $bindings = null, $firstFilter = false)
     {
        if (!$sql) {
            return;
        }

        $data = [
            'sql' => $sql,
            'bindings' => $bindings,
        ];

        if ($firstFilter) { //wstawia filtr na poczatek tablicy
            array_unshift($this->filters, $data);
        } else {
            $this->filters[] = $data;
        }

        return $this;
     }

     /**
     * Dodaje filtry na podstawie $searchableColumns
     */
     protected function pushFiltersForSearchableColumns()
     {
         $appliedFilters = $this->appliedFilters;
         $searchableColumns = $this->searchableColumns;
 
         //brak danych do szukania
         if (!$appliedFilters || !$searchableColumns) {
             return false;
         }
 
         //Ustawia tablice z warunkami dla where (wywala warunki, ktore sa puste)
         $where = [];
         $whereParam = [];
 
         $sql = '';
         $bindings = [];
 
         foreach ($appliedFilters as $key => $val) {
             if (is_array($val)) {
 
                 //multiple (warunek IN (....)
                 if (count($val)) {
                     $where[$key] = self::getValuesFromMultiple($val);
                     $whereParam[$key] = array('in' => true);
                 }
             } else {
                 if ((string) $val != '') {
                     $where[$key] = trim($val);
                 }
             }
         }
 
         //brak danych w polach filtrujacych
         if (!$where) {
             return false;
         }
 
         foreach ($searchableColumns as $operator => $columns) {
             $queryOperator = '';
             $columnCast = '';
             $expressionLeft = '';
             $expressionRight = '';
 
             switch ($operator) {
                 case 'like':
                     $queryOperator = 'LIKE';
                     $expressionLeft = '%';
                     $expressionRight = '%';
                     break;
 
                 case 'like%':
                     $queryOperator = 'LIKE';
                     $expressionRight = '%';
                     break;
 
                 case '%like':
                     $queryOperator = 'LIKE';
                     $expressionRight = '%';
                     break;
 
                 case '=':
                     $queryOperator = '=';
                     break;
 
                 case 'likestr':
                     $queryOperator = 'LIKE';
                     $columnCast = '::text';
                     $expressionLeft = '%';
                     $expressionRight = '%';
                     break;
 
                 case 'likestr%':
                     $queryOperator = 'LIKE';
                     $columnCast = '::text';
                     $expressionRight = '%';
                     break;
 
                 case '=str':
                     $queryOperator = '=';
                     $columnCast = '::text';
                     break;
 
                 case '=bit':
                     $queryOperator = '=';
                     $columnCast = '::int';
                     break;
             }
 
             if (self::getDriver() == 'pgsql' && $queryOperator == 'LIKE') {
                 $queryOperator = 'ILIKE';
             }
 

             foreach ($columns as $column) {

                 $columnName = trim($column);
                 $paramName = $columnName;
                 $bindings = [];
 
                 if (isset($where[$paramName])) {
                     $queryValue = $where[$paramName];
 
                     //zapytania IN (SQL jest "surowy" bez parametrow)
                     if (isset($whereParam[$paramName]['in'])) {
                         $sql = $columnName.$columnCast.' IN ('.$queryValue.')';
                     } else {
                         $sql = $columnName.$columnCast.' '.$queryOperator.' :'.$paramName;
                         $queryValue = $expressionLeft.$queryValue.$expressionRight;
                         $bindings[$paramName] = $queryValue;
                     }
 
                     $this->pushFilter($sql, $bindings);
                 }
             }
         }
     }

    /**
     * Pobiera polaczone filtry.
     */
    protected function getFilters()
    {
        $sql = [];
        $bindings = [];

        foreach ($this->filters as $filter) {

            array_push($sql, $filter['sql']);

            if ($filter['bindings']) {
                $bindings = array_merge($bindings, $filter['bindings']);
            }
        }

        if ($sql) {
            return ['sql' => implode(' AND ', $sql), 'bindings' => $bindings];
        } else {
            return null;
        }
    }

    public function resetFilters()
    {
        $this->filters = [];
    }

    public function pushAppliedFilters(array $appliedFilters)
    {
        $this->appliedFilters = $appliedFilters;

        $this->pushFiltersForSearchableColumns();

        return $this;
    }

    protected function getAppliedFilter($key)
    {
        return array_get($this->appliedFilters, $key);
    }

    /**
     * Dla warunkow IN (z pola select "multiple").
     */
     private static function getValuesFromMultiple($parameters, $intValue = true)
     {
         $values = '';
 
         if (is_array($parameters)) {
             $arrValues = array();
             foreach ($parameters as $value) {
                 $arrValues[] = $intValue ? (int) $value : ("'".$value."'");
             }
 
             $values = implode(',', $arrValues);
         } else {
             $values = $parameters;
         }
 
         return $values;
     }     
}