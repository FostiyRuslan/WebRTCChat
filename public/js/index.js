(function($) {
    $(document).ready(function () {
        $('#create-room').on('click', function () {
            var roomId = $('#room-id').val();

            if (roomId) {
                location.replace('/room/' + roomId);
            }
        });
    });
})(jQuery);