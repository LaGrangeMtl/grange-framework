
<?php if(isset($activeLevels[0]['children'])) { ?>

	<nav class="level1">
		<?php foreach($activeLevels[0]['children'] as $id => $page) { ?>
		    <a href="index.php?lev[0]=<?php echo $activeLevels[0]['id'] ?>&lev[1]=<?php echo $id ?>" class="<?php echo $_GET['lev'][1] == $id ? 'active' : '' ?>"><?php echo $page['title'] ?></a>
		<?php } ?>
	</nav>

<?php } ?>