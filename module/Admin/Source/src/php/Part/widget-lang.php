<?php

$uri = site('uri_cut_language');
$languages = Language::getAll();

?>

<?php if(!empty($languages)): ?>
	<div class="d-flex flex-wrap justify-content-center">
		<?php foreach($languages as $language): ?>
			<?php if($language['key'] === site('language_current')) continue; ?>
			<a class="nav-flag" href="<?= site('url') ?>/<?= $language['key'] . $uri ?>" title="<?= $language['name'] ?>">
				<img src="<?= Asset::url() ?>/<?= lang($language['key'], 'icon') ?>" alt="<?= $language['key'] ?>">
			</a>
		<?php endforeach; ?>
	</div>
<?php endif; ?>
