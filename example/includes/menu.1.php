
<?php if(isset($activeLevels[0]['children'])) { ?>

	<nav class="level1" data-parent="<?php echo $activeLevels[0]['id'] ?>" data-level="1">
		<?php foreach($activeLevels[0]['children'] as $page) { 
			$id = $page['id'];
		?>
		    <a data-id="<?php echo $id; ?>" href="index.php?lev[0]=<?php echo $activeLevels[0]['id'] ?>&lev[1]=<?php echo $id ?>" class="<?php echo $_GET['lev'][1] == $id ? 'active' : '' ?>"><?php echo $page['title'] ?></a>
		<?php } ?>
	</nav>

<?php } ?>