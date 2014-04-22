

<nav class="level0">
	<?php foreach($pages as $id => $page) { ?>
	    <a href="index.php?lev[0]=<?php echo $id ?>" class="<?php echo $_GET['lev'][0] == $id ? 'active' : '' ?>"><?php echo $page['title'] ?></a>
	<?php } ?>
</nav>