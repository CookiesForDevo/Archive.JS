/* global jQuery,wpData */
(function($) {

	var ArchiveJS = window.ArchiveJS;

	ArchiveJS = (function() {

		function ArchiveJS( scope, params, iteration ) {

			var _ = this;

			_.scope = $(scope);
			_.iteration = iteration;

			_.defaults = {
				nextArrow			: '.js-next-arrow',
				prevArrow			: '.js-prev-arrow',
				resultsOuterWrap	: '.js-results-outer-wrap',
				resultsInnerWrap	: '.js-results-inner-wrap'
			};

			_.config = $.extend( _.defaults, params, _.data );

			_.init();

		}

		return ArchiveJS;

	}());


	ArchiveJS.prototype.init = function() {

		var _ = this;


		_.setupEvents();
		_.scope.trigger('init', [_]);

		_.refresh();

	};


	ArchiveJS.prototype.setupEvents = function() {

		var _ = this;

		_.scope
			.on('submit.ArchiveJS', _.scope.find('form'), function( e ) {
				e.preventDefault();
	
				var form = $(this);
	
				$( form ).find(':input').each( function() {
					_.scope.data( $(this).attr('name'), $(this).val() );
				});
		
				_.update();
	
			})

			.on('click.ArchiveJS', '.js-single-option', function( e ) {
				e.preventDefault();

				if ( $(this).hasClass('active') ) {
					$(this).removeClass('active');
					_.scope.data( $(this).data('name'), '' );

				} else {
					_.scope.find('[data-' + $(this).data('name') + ']').removeClass('active');
					$(this).addClass('active');
					_.scope.data( $(this).data('name'), $(this).data('value') );

				} // endif
	
				_.update();
	
			})
	
			.on('click.ArchiveJS', _.config.prevArrow, function( e ) {
				e.preventDefault();

				if ( $(this).hasClass('disabled') ) {
					return;
				}
	
				var paged = _.scope.data('paged') - 1;
				_.scope.data('paged', paged);
	
				_.update();
	
			})
	
			.on('click.ArchiveJS', _.config.nextArrow, function( e ) {
				e.preventDefault();

				if ( $(this).hasClass('disabled') ) {
					return;
				}

				var paged = _.scope.data('paged') + 1;
				_.scope.data('paged', paged);
	
				_.update();
	
			})
		;

	};


	ArchiveJS.prototype.refresh = function() {

		var _ = this;

		if ( ! _.scope.data('paged') ) {
			_.scope.data('paged', 0 );
		}

		// does it exist?
		if ( $( _.config.prevArrow ).length ) {

			// are there more pages?
			if ( _.scope.data('paged') > 1 ) {
				$( _.config.prevArrow ).removeClass('disabled');
			} else {
				$( _.config.prevArrow ).addClass('disabled');
			}

		}

		// does it exist?
		if ( $( _.config.nextArrow ).length ) {

			// is the current paged less than the total number of pages?
			if ( $( _.config.resultsInnerWrap ).data('pages') > 1 && _.scope.data('paged') < $( _.config.resultsInnerWrap ).data('pages') ) {
				$( _.config.nextArrow ).removeClass('disabled');
			} else {
				$( _.config.nextArrow ).addClass('disabled');
			}

		}

		_.scope.trigger('refresh', [_]);

	};


	ArchiveJS.prototype.update = function() {

		var _ = this;

		_.scope.trigger('updateStart', [_] );

			$.ajax({
				type		: 'get',
				dataType	: 'html',
				url			: wpData.ajaxURL,
				data		: _.scope.data(),
				success		: function( r ) {

					$( _.config.resultsOuterWrap ).fadeOut('slow', function() {
						_.scope.trigger('updateEnd', [_] );
						$(this).html( r ).fadeIn('slow'); 
						_.refresh();
					});
				}
			});

	};


	$.fn.ArchiveJS = function() {

		var
			l = this.length,
			c = 0
		;

		for ( c; c < l; c++ ) {
			this[c].ArchiveJS = new ArchiveJS( this[c], arguments[0], c );
		}

		return this;

	};


}(jQuery));