<?php Theme::header(); ?>

<main class="d-flex w-100 h-100">
	<div class="container d-flex flex-column">
		<div class="row vh-100">
			<div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
				<div class="d-table-cell align-middle">

					<div class="text-center mt-4">
						<?php if(!empty(Setting::get('site')->logo)): ?>
							<img class="w-50 mb-3" src="<?= Asset::path() ?>/<?= Setting::get('site')->logo ?>" alt="<?= Language::get('auth')->placeholder->logo ?>">
						<?php endif; ?>
						<h1 class="h2"><?= Setting::get('site')->name ?></h1>
						<p class="lead"><?= Language::get('auth')->title->restore ?></p>
					</div>

					<div class="card">
						<div class="card-body">
							<div class="m-sm-4">
								<form method="POST">
									<div class="mb-3">
										<label class="form-label"><?= Language::get('auth')->field->email ?></label>
										<input class="form-control form-control-lg" type="email" name="email" placeholder="<?= Language::get('auth')->placeholder->email ?>">
										<small>
											<a href="/admin/login"><?= Language::get('auth')->button->login ?></a>
											<?php if(Setting::get('main')->enable_registration == 'true'): ?>
												• <a href="/admin/register"><?= Language::get('auth')->button->register ?></a>
											<?php endif; ?>
										</small>
									</div>
									<div class="text-center mt-3">
										<button type="submit" class="btn btn-lg btn-primary"><?= Language::get('auth')->button->restore ?></button>
									</div>
								</form>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</main>

<?php Theme::footer(); ?>