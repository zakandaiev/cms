<?php Theme::header(); ?>

<div class="page-header">
	<div class="container">
		<div class="row">
			<div class="col-md-offset-1 col-md-10 text-center">
				<h1 class="text-uppercase"><?= $page->title ?></h1>
				<?php if(!empty($page->excerpt)): ?>
					<p class="lead"><?= $page->excerpt ?></p>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>

<div class="section">
	<div class="container">
		<div class="row">
			<div class="col-md-8">
				<div class="section-row">
					<div class="section-title">
						<h2 class="title"><?= __('Contact Information') ?></h2>
					</div>
					<?= $page->content ?>
					<ul class="contact">
						<?php
							$phones = Menu::get('phones')->items;
							$email = site('email');
							$address = site('address');
						?>
						<?php foreach($phones as $phone): ?>
							<li><i class="fa fa-phone"></i> <a href="tel:<?= $phone->url ?>"><?= $phone->name ?></a></li>
						<?php endforeach; ?>
						<?php if(!empty($email)): ?>
							<li><i class="fa fa-envelope"></i> <a href="mailto:<?= $email ?>"><?=$email ?></a></li>
						<?php endif; ?>
						<?php if(!empty($address)): ?>
							<li><i class="fa fa-map-marker"></i> <?= $address ?></li>
						<?php endif; ?>
					</ul>
				</div>

				<div class="section-row">
					<div class="section-title">
						<h2 class="title"><?= __('Mail us') ?></h2>
					</div>
					<form>
						<div class="row">
							<div class="col-md-12">
								<div class="form-group">
									<input class="input" type="email" name="email" placeholder="<?= __('Email') ?>">
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<input class="input" type="text" name="subject" placeholder="<?= __('Subject') ?>">
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<textarea class="input" name="message" placeholder="<?= __('Message') ?>"></textarea>
								</div>
								<button class="primary-button"><?= __('Submit') ?></button>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="col-md-4">
				<?php Theme::widget('socials'); ?>
				<?php Theme::widget('newsletter'); ?>
			</div>
		</div>
	</div>
</div>

<?php Theme::footer(); ?>
