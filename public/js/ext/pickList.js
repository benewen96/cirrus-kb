(function ($) {
  $.fn.pickList = function (options) {
    const opts = $.extend({}, $.fn.pickList.defaults, options);

    this.fill = function () {
      let option = '';

      $.each(opts.data, (key, val) => {
        option += `<option id=${val.id}>${val.text}</option>`;
      });
      this.find('#pickData').append(option);
    };
    this.controll = function () {
      const pickThis = this;

      $('#pAdd').on('click', () => {
        const p = pickThis.find('#pickData option:selected');
        p.clone().appendTo('#pickListResult');
        p.remove();
      });

      $('#pAddAll').on('click', () => {
        const p = pickThis.find('#pickData option');
        p.clone().appendTo('#pickListResult');
        p.remove();
      });

      $('#pRemove').on('click', () => {
        const p = pickThis.find('#pickListResult option:selected');
        p.clone().appendTo('#pickData');
        p.remove();
      });

      $('#pRemoveAll').on('click', () => {
        const p = pickThis.find('#pickListResult option');
        p.clone().appendTo('#pickData');
        p.remove();
      });
    };
    this.getValues = function () {
      const objResult = [];
      this.find('#pickListResult option').each(function () {
        objResult.push({ id: this.id, text: this.text });
      });
      return objResult;
    };
    this.init = function () {
      const pickListHtml =
                 `${"<div class='row'>" +
                 "  <div class='col-sm-5'>" +
                 "	 <select class='form-control pickListSelect' id='pickData' multiple></select>" +
                 ' </div>' +
                 " <div class='col-sm-2 pickListButtons'>" +
                 "	<button id='pAdd' class='btn btn-primary btn-sm'>"}${opts.add}</button>` +
                 `      <button id='pAddAll' class='btn btn-primary btn-sm'>${opts.addAll}</button>` +
                 `	<button id='pRemove' class='btn btn-primary btn-sm'>${opts.remove}</button>` +
                 `	<button id='pRemoveAll' class='btn btn-primary btn-sm'>${opts.removeAll}</button>` +
                 ' </div>' +
                 ' <div class=\'col-sm-5\'>' +
                 '    <select class=\'form-control pickListSelect\' id=\'pickListResult\' multiple></select>' +
                 ' </div>' +
                 '</div>';

      this.append(pickListHtml);

      this.fill();
      this.controll();
    };

    this.init();
    return this;
  };

  $.fn.pickList.defaults = {
    add: 'Add',
    addAll: 'Add All',
    remove: 'Remove',
    removeAll: 'Remove All',
  };
}(jQuery));
