<?php Theme::header(); ?>

<div class="wrapper">
	<?php Theme::block('sidebar'); ?>

	<div class="main">
		<?php Theme::block('navbar-top'); ?>

		<main class="content">
			<div class="container-fluid p-0">

				<div class="row mb-3">
					<div class="col-auto">
						<h1 class="h3 d-inline align-middle">Pages</h1>
					</div>

					<div class="col-auto ms-auto text-end mt-n1">
						<a href="/admin/page/add?category" class="btn btn-secondary me-2">Add category</a>
						<a href="/admin/page/add" class="btn btn-primary">Add page</a>
					</div>
				</div>

				<div class="card">
					<?php if(!empty(Request::$get['back'])): ?>
						<div class="card-header">
							<h5 class="card-title mb-0"><a href="<?= hc(Request::$get['back']) ?>"><i class="align-middle" data-feather="arrow-left"></i> Back</a></h5>
						</div>
					<?php endif; ?>
					<div class="card-body">
						<?php if(!empty($pages)): ?>
							<table class="table table table-striped table-sm m-0">
								<thead>
									<tr>
										<th>Title</th>
										<th>Author</th>
										<th>Publish date</th>
										<th>Published</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<?php foreach($pages as $page): ?>
										<tr>
											<td>
												<?php if($page->is_category): ?>
													<i class="align-middle" data-feather="folder"></i>
													<a href="/admin/page/category/<?= $page->id ?>?back=<?= urlencode(Request::$uri) ?>"> <span class="align-middle"><?= $page->title ?></span></a>
												<?php else: ?>
													<i class="align-middle" data-feather="file-text"></i> <span class="align-middle"><?= $page->title ?></span>
												<?php endif; ?>
												<?php if($page->url === 'home') $page->url = ''; ?>
												<a href="/<?= $page->url ?>" target="_blank"><i class="align-middle feather-sm" data-feather="external-link"></i></a>
											</td>
											<td><a href="/admin/profile/<?= $page->author ?>"><?= $page->author_name ?></a></td>
											<td title="<?= format_date($page->date_publish) ?>"><?= date_when($page->date_publish) ?></td>
											<td>
												<?php if($page->is_pending): ?>
													<span title="Will be published at <?= format_date($page->date_publish) ?>"><i class="align-middle" data-feather="clock"></i></span>
												<?php elseif($page->enabled): ?>
													<i class="align-middle" data-feather="check"></i>
												<?php else: ?>
													<i class="align-middle" data-feather="x"></i>
												<?php endif; ?>
											</td>
											<td class="table-action">
												<a href="/admin/page/edit/<?= $page->id ?>"><i data-feather="edit"></i></a>
												<a data-delete="<?php Form::delete('Page', $page->id); ?>" data-confirm="Delete?" data-counter="#pagination-counter" href="#"><i data-feather="trash"></i></a>
											</td>
										</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						<?php else: ?>
							<h5 class="card-title mb-0">There are not pages yet.</h5>
						<?php endif; ?>
						<div class="mt-4">
							<?php Theme::pagination($pagination); ?>
						</div>
					</div>
				</div>

			</div>
		</main>

		<?php Theme::block('navbar-bottom'); ?>
	</div>
</div>

<?php Theme::footer(); ?>