<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>MES System - PARTNER SC</title>
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="stylesheet" type="text/css" href="codebase/css/common.css" />
    <link rel="stylesheet" type="text/css" href="codebase/css/loader.css" />
    <link rel="stylesheet" type="text/css" href="codebase/dhtmlx/skins/web/dhtmlx.css" />
    <script type="text/javascript" src="codebase/require/require.js"></script>
    <script type="text/javascript" src="codebase/app/loader.js"></script>        
    @if (Auth::check())
        <link rel="stylesheet" type="text/css"
            href="codebase/dhtmlx/sources/dhtmlxScheduler/codebase/dhtmlxscheduler_material.css" />
        <link rel="stylesheet" type="text/css" href="css/timeline.css" />
        <link rel="stylesheet" type="text/css" href="css/zlecenia.css" />
        <link rel="stylesheet" type="text/css" href="codebase/fonts/font_roboto/roboto.css" />
        <link rel="stylesheet" type="text/css" href="codebase/fonts/font_awesome/css/font-awesome.min.css" />
        <script type="text/javascript" src="codebase/app/common.js"></script>
    @else
        <script type="text/javascript" src="codebase/app/login.js"></script>
    @endif
    <style>
        div#vp {
            border: 1px solid #cecece;
            height: 100%;
            top: -2000px;
        }

        /* block's bottom border, height and overflow */
        .block_dhxform_item_label_left.myBlock .dhxform_obj_material.dhxform_block {
            height: 265px;
            overflow: auto;
        }
    </style>
</head>

<body>
    <div id="app"></div>
    <script src="{{ asset('js/app.js') }}"></script>    
    <script>
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFmYjdkMWFkMWI1ZjMxMThjNDBiMTFlY2QwMTE0MTc1OTVlNWVlZTZlNTBlMTQ5NWRmNDhiMzg0Mzg0OTZiY2IwMDg1ZTI3NzU1M2Q5ZDA5In0.eyJhdWQiOiIxIiwianRpIjoiMWZiN2QxYWQxYjVmMzExOGM0MGIxMWVjZDAxMTQxNzU5NWU1ZWVlNmU1MGUxNDk1ZGY0OGIzODQzODQ5NmJjYjAwODVlMjc3NTUzZDlkMDkiLCJpYXQiOjE1NTkwMjY0NTYsIm5iZiI6MTU1OTAyNjQ1NiwiZXhwIjoxNTc0OTI0MDUwLCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.HA_Xq3zBYxYM7HqLvoybCn7w8JrdzZJynTPoGkLwvzJ5x4Uw32hfdJdC7wpWT4edNuBV0nEJu_EUN9icpov5tsGCK_s-NjQDWJH_oCNR7bRn5pO2gOzFTxXYRlWJfXZGgUS4XNMAgeU1J-IFwMPndJmUIHV44-iGRXk2uPS9xTMfMDR-R6cgUwRaZt-BUvSxJMlZY15-s-L3VRmm4W4nhhGyu0caQxHNQuzBxMkg86MW4RVV-sRiWfRpD_xpUkXP3O1TuYwtGIcOYPvpDiVcSrm7MzjKX7xOhC3hWgIDdU4dacK2U7yEly1DpRY17FGxuZv3u8LpnlaRVdn751bkovLFGeE5fcG6_JiacVQ0NHfEr5wFr0dc7fgJ6NcIIw3WiUcQkbMli8ukCGvlpG5enz5iFBTxJWyejRqkB0BTLkT1nQSrCKTN4MX9Ie3JM6_uDZ6S7odgY5urvKG-y057yGV_hnV4hbkwpPVXZhUXNBSJnq3y7XArk_ccQfl6sypNEJr7Nloij17O1wQHh0Vnadb8APdEJ1RmAN7Jj3pL2_3psZSgoKvHVbEJdPMiFvZhf4iwlZ3fPMhJFkGtnPDo2MXJwrdNEMDZvEBW0xtX0BWOmRc_Qr304eAd5Nmej2vXxoHWHGb_cW_F7E9_4GKstypyn5EW2nTvKxOQc1L1zRo'
        
    }
});        

    </script>
</body>
