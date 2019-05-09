<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>MES System - PARTNER SC</title>
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="stylesheet" type="text/css" href="codebase/css/common.css" />
    <link rel="stylesheet" type="text/css" href="codebase/css/loader.css" />
    <link rel="stylesheet" type="text/css" href="codebase/dhtmlx/skins/web/dhtmlx.css" />
    <link rel="stylesheet" type="text/css"
        href="codebase/dhtmlx/sources/dhtmlxScheduler/codebase/dhtmlxscheduler_material.css" />
    <link rel="stylesheet" type="text/css" href="css/timeline.css" />
    <link rel="stylesheet" type="text/css" href="css/zlecenia.css" />
    <link rel="stylesheet" type="text/css" href="codebase/fonts/font_roboto/roboto.css" />
    <link rel="stylesheet" type="text/css" href="codebase/fonts/font_awesome/css/font-awesome.min.css" />
    <script type="text/javascript" src="codebase/require/require.js"></script>
    <script type="text/javascript" src="codebase/app/loader.js"></script>
    <script type="text/javascript" src="codebase/app/common.js"></script>
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
    <form id="loginForm" action="api/login/validate" method="POST">
    </form>
</body>
