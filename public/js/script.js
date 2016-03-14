$(function(){
	"use strict";

	function openModal(ev) {
		ajaxify.loadTemplate('modals/featured-topics-ex-sort', function(featuredTpl) {
			socket.emit('admin.getFeaturedTopics', {tid: ajaxify.data.tid}, function(err, topics) {
				if (err) return console.log(err);

				bootbox.confirm(templates.parse(featuredTpl, {topics:topics}), function(confirm) {
					var tids = [];
					$('.featured-topic').each(function(i) {
						tids.push(this.getAttribute('data-tid'));
					});

					socket.emit('admin.setFeaturedTopics', {tids: tids});
				}).on("shown.bs.modal", function() {
					$('span.timeago').timeago();
					$('#sort-featured').sortable().disableSelection();

					$('.delete-featured').on('click', function() {
						$(this).parents('.panel').remove();
					});
				});
			});
		});
	}

	$(window).on('action:ajaxify.end', function(ev, data) {
		if (data.url.match(/^topic/)) {
			$('.topic').on('click', '.thread-tools .mark-featured', openModal);
		}else if (data.url.match(/^admin\/plugins\/featured-topics-extended/)) {
			$('#resort').on('click', openModal);
		}
	});
});