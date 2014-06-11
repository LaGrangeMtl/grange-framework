 <?php require('includes/config.php'); ?>
<!DOCTYPE html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Framework La Grange | <?php echo $currentPage['title'] ?></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="css/master.css">
        <link rel="canonical" href="<?php echo $link ?>">
        <script src="js/vendor/modernizr.js"></script>
        <script src="js/vendor/es5-shim.js"></script>
        <script src="js/vendor/es5-sham.js"></script>
        <script data-main="js/app.js" src="js/require.js?v=0.0.1"></script>

    </head>
    <body>

        <header>
            <div id="menu_0"><?php require('includes/menu.0.php'); ?></div>
            <div id="menu_1"><?php require('includes/menu.1.php'); ?></div>
            <div id="menu_2"><?php require('includes/menu.2.php'); ?></div>
        </header>
        
        <article class="loadedContent">
            <h1><?php echo $currentPage['title'] ?></h1>
            <div class="content">
                <img src="<?php echo $currentPage['image'] ?>">
            </div>
        </article>
      
    </body>
</html>
