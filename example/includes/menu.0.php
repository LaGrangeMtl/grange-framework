

<nav class="level0" data-level="0">
	<?php foreach($pages as $page) { 
		$id = $page['id'];
	?>
	    <a data-id="<?php echo $id; ?>" href="index.php?lev[0]=<?php echo $id ?>" class="<?php echo $_GET['lev'][0] == $id ? 'active' : '' ?>"><?php echo $page['title'] ?></a>
	<?php } ?>
</nav>