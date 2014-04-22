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
        <script data-main="js/app.js" src="js/require.js"></script>

    </head>
    <body>

        <header>
            <?php require('includes/menu.0.php'); ?>
            <?php require('includes/menu.1.php'); ?>
            <?php require('includes/menu.2.php'); ?>
        </header>
        
        <section class="loadedContent">
            <h1><?php echo $currentPage['title'] ?></h1>
            <div class="content">
                <img src="<?php echo $currentPage['image'] ?>">
            </div>
        </section>
      
    </body>
</html>
