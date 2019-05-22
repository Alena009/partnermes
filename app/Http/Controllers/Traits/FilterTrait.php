<?php

namespace App\Http\Controllers\Traits;

use Request;

trait FilterTrait
{
    private $filters = array();
    private $filterParameters = array();

    protected function pushFilter($type, array $parameters = null)
    {
        $this->filterParameters = $parameters;
        $name = array_get($this->filterParameters, 'name');
        $name2 = '';

        //pierwsze wejscie w rejestr (nie ma zadnego $query)
        $applyDefaults = !Request::has('filter') ? true : false;

        switch ($type) {
            case 'date_from_to':
            case 'text_from_to':
                $label = array_get($this->filterParameters, 'label', 'data od - do');
                $name = array_get($this->filterParameters, 'name', 'date_from');
                $name2 = array_get($this->filterParameters, 'name2', 'date_to');
                $parameters = array('name' => $name, 'name2' => $name2, 'label' => $label);
                break;

            case 'show_all':
                $type = 'select';
                $name = 'showAll';
                $parameters = array('name' => $name, 'label' => 'pokaż wszystkie', 'source' => array('arrShowAll' => array(1 => 'tak')));
            break;
        }

        //podmiana paremetrow zdefiniowanych wyzej, jesli przekazano pole wspolne, ale z wyjatkiem
        if (count($this->filterParameters)) {
            foreach ($this->filterParameters as $key => $val) {
                $parameters[$key] = $this->filterParameters[$key];
            }
        }

        //ponowne przepisanie do zmiennej
        $this->filterParameters = $parameters;

        //podpiecie arr dla <select> pod View
        $source = array_get($this->filterParameters, 'source');
        if ($source && is_array($source) && $sourceArr = $source) {
            $source = key($sourceArr);
            $this->addViewData($source, $sourceArr[$source]);
        }

        //wartosci domyslne i filtry uzytkownika
        if ($applyDefaults) {
            if (isset($parameters['default'])) {
                Request::merge(array($name => $parameters['default']));
            }
            if ($name2 && isset($parameters['default2'])) {
                Request::merge(array($name2 => $parameters['default2']));
            }
        }

        $this->filters[] = array(
            'type' => $type,
            'name' => $name,
            'value' => array_get($this->filterParameters, 'value'),
            'label' => array_get($this->filterParameters, 'label'),
            'source' => $source,
            'multiple' => array_get($this->filterParameters, 'multiple'),
            'iClass' => (array_get($this->filterParameters, 'multiple')) ? 'multiple' : array_get($this->filterParameters, 'iClass'), //klasa pola (dodaje clase multiple, jak jest multiple)
            'iParameters' => array_get($this->filterParameters, 'iParameters'), //dodakowe atrybuty
            'iStyle' => array_get($this->filterParameters, 'iStyle'), //styl input
            'pClass' => array_get($this->filterParameters, 'pClass'), //klasa p
            'pId' => array_get($this->filterParameters, 'pId'), //Id p
            'lClass' => array_get($this->filterParameters, 'lClass'), //klasa label
            'noEmpty' => array_get($this->filterParameters, 'noEmpty'), //dla select
            'hideInAppliedFilters' => array_get($this->filterParameters, 'hideInAppliedFilters'), //nie pokazuje w zastosowane filtyry
            'name2' => array_get($this->filterParameters, 'name2'), //przypadek pola z datami (od do), taki sam wyjatek jest w controller_Module::getList
            'inline' => array_get($this->filterParameters, 'inline', false),
        );
    }

    protected function getFilters()
    {
        return $this->filters;
    }

    /**
     * Pobiera dane z GET (dla modelu) na podstawie uzupelnionych przez uzytkownika filtrow
     * (zwraca TYLKO pola zdefiniowane w $this->filters).
     */
     protected function getAppliedFilters()
     {
         $request = Request::all();
 
         //filtry - zaczytanie zmiennych z GET
         $filters = array();
         foreach ($this->filters as $item) {
             $name = $item['name'];
             if (isset($request[$name])) {
                 $filters[$name] = !is_array($request[$name]) ? trim($request[$name]) : $request[$name];
             }
 
             //przypadek pola z datami
             $name = $item['name2'];
             if ($name && isset($request[$name])) {
                 $filters[$name] = trim($request[$name]);
             }
         }

         return $filters;
     }

    /**
     * Pobiera kolumne sortujaca (na postawie GET lub zaczytana z modelu).
     */
     protected function getAppliedOrderBy()
     {
         $orderBy = Request::input('orderBy');
         if (!$orderBy && $this->repository) {
             $orderBy = call_user_func(array($this->repository, 'getDefaultOrderBy'));
         }
 
         return $orderBy;
     }     
}