/*Start of drag drop*/
!function($) {
    var dragging, placeholders = $();
    $.fn.sortable = function(options) {
        var method = String(options);
        options = $.extend({
            connectWith: false
        }, options);
        return this.each(function() {
            if (/^enable|disable|destroy$/.test(method)) {
                var items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
                if (method == 'destroy') {
                    items.add(this).removeData('connectWith items')
                        .off('dragstart dragend selectstart dragover dragenter drop');
                }
                return;
            }
            var isHandle, index, items = $(this).children(options.items);
            var placeholder = $('<' + (/^ul|ol|div$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
            items.find(options.handle).mousedown(function() {
                isHandle = true;
            }).mouseup(function() {
                isHandle = false;
            });
            $(this).data('items', options.items)
            placeholders = placeholders.add(placeholder);
            if (options.connectWith) {
                $(options.connectWith).add(this).data('connectWith', options.connectWith);
            }
            items.attr('draggable', 'true').on('dragstart', function(e) {
                if (options.handle && !isHandle) {
                    return false;
                }
                isHandle = false;
                var dt = e.originalEvent.dataTransfer;
                dt.effectAllowed = 'move';
                dt.setData('Text', 'dummy');
                dragging = $(this);
                index = (dragging).addClass('sortable-dragging').index();
            }).on('dragend', function() {
                (dragging = $(this)).removeClass('sortable-dragging').show();
                placeholders.detach();
                if (index != dragging.index()) {
                    items.parent().trigger('sortupdate', {
                        item: dragging,
                        prevIndex:index,
                        currIndex:dragging.index()
                    });
                }
                dragging = null;
            }).not('a[href], img').on('selectstart', function() {
                this.dragDrop && this.dragDrop();
                return false;
            }).end().add([this, placeholder]).on('dragover dragenter drop', function(e) {
                if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
                    return true;
                }
                if (e.type == 'drop') {
                    e.stopPropagation();
                    placeholders.filter(':visible').after(dragging);
                    return false;
                }
                e.preventDefault();
                e.originalEvent.dataTransfer.dropEffect = 'move';
                if (items.is(this)) {
                    if (options.forcePlaceholderSize) {
                        placeholder.height(dragging.outerHeight());
                    }
                    dragging.hide();
                    $(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
                    placeholders.not(placeholder).detach();
                } else if (!placeholders.is(this) && !$(this).children(options.items).length) {
                    placeholders.detach();
                    $(this).append(placeholder);
                }
                return false;
            });
        });
    };
}(jQuery);


/*end of drag drop*/
