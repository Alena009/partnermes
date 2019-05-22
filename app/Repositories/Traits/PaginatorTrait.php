<?php

namespace App\Repositories\Traits;

use Config;

trait PaginatorTrait
{
    protected function getDriver()
    {
        return Config::get('database.connections.'.Config::get('database.default').'.driver');
    }

    protected function getSelectExpressionForPaginator($query, $orderBy = null, $limit = null, $page = null)
    {
        if ($limit) {
            $offset = ($page == 1) ? 0 : (($page - 1) * $limit);
            $selectExpression = '';

            switch (self::getDriver()) {
                case 'mysql':
                case 'pgsql':
                    $selectExpression = $query.' ORDER BY '.$orderBy.' LIMIT '.$limit.' OFFSET '.$offset;
                    break;

                case 'sqlsrv':
                    $start = $offset + 1;
                    $finish = $offset + $limit;

                    $query = 'select row_number() over (order by '.$orderBy.') as row_num, '.substr(trim($query), 6);
                    $selectExpression = 'select * from ('.$query.') as temp_table where row_num between '.$start.' AND '.$finish;
                    break;
            }
        } else {
            $selectExpression = $query.(($orderBy) ? (' ORDER BY '.$orderBy) : '');
        }

        return $selectExpression;
    }    
}