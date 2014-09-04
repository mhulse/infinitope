/*
var $isotope = $('.isotope').imagesLoaded(function() {
	$isotope.isotope({
		itemSelector: 'figure',
		gutter: 10
	})
});
*/
// Overwrite Isotope methods:
var __resetLayout = Isotope.prototype._resetLayout;
Isotope.prototype._resetLayout = function() {
	__resetLayout.call(this);
	// Reset packer:
	var parentSize = getSize(this.element.parentNode);
	var colW = this.columnWidth + this.gutter;
	this.fitWidth = Math.floor((parentSize.innerWidth + this.gutter) / colW) * colW;
	console.log(colW, this.fitWidth)
	this.packer.width = this.fitWidth;
	this.packer.height = Number.POSITIVE_INFINITY;
	this.packer.reset();
};
Isotope.prototype._getContainerSize = function() {
	// Remove empty space from fit width:
	var emptyWidth = 0;
	for (var i=0, len = this.packer.spaces.length; i < len; i++) {
		var space = this.packer.spaces[i];
		if (space.y === 0 && space.height === Number.POSITIVE_INFINITY) {
			emptyWidth += space.width;
		}
	}
	return {
		width: this.fitWidth - this.gutter,
		height: this.maxY - this.gutter
	};
};
// Always resize:
Isotope.prototype.resize = function() { this.layout(); };
/*
docReady(function() {
	var container = document.querySelector('.isotope');
	var pckry = new Isotope(container, {
		itemSelector: '.isotope_item',
		columnWidth: 150,
		gutter: 20
	});
});
*/
