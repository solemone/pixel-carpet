var columns = ['country', 'responsecode', 'url'];
var host = [];
var responsecode = [];
var url = [];
var method = [];
var referer = [];
var useragent = [];
var zeit = [];
var country = [];
var color;

var filterNumber = 10;
var wrapper;
var logText;

$(function() {

    wrapper = $('#wrapper');
    logText = $('#logText');

    $.getJSON("./data/apache-log-geodata.json", function(data) {
        $.each(data, function(key, val) {
            host.push(val.Host);
            responsecode.push(val.ResponseCode);
            url.push(val.URL);
            method.push(val.Method);            
            referer.push(val.Referer);
            useragent.push(val.UserAgent);
            zeit.push(val.Time);
            country.push(val.Country);
        });
        init();
    });


    // Steuerelemente

    // Auf- und Zuklappen
    $('h1').on('click', function() {
        $(this).toggleClass('active');
        $(this).next().toggleClass('active');
    });

    // Colorsheme Change
    $('#colorsheme').on('change', function() {
        $('html').removeClass(function() {
            return $(this).attr('class');
        }).addClass($(this).val());
    });

    // Line Height
    $('#lineheight').on('change', function() {
        $('.logline').css('margin-bottom', $(this).val() + 'px');
    });

    // Toggle Time View
    $('#toggleTimeView').on('click', function() {
        $('html').toggleClass('timealternative');
    });

    // RegX
    var firstClickReg = true;
    $('#regXButton').on('click', submitFilter);
    $('#regXForm').on('submit', submitFilter);

    function submitFilter() {
        colorRegEx($('#regXcat').val(), $('#regX').val());

        if(firstClickReg == true) {
            $('#regXdelete, #regXreset').removeClass('hidden');
            firstClickReg = false;
        }
        // $('#regX').val('');

        return false;
    }

    $('#regXdelete').on('click', function() {
        $('.regX').remove();
        $('#regXdelete, #regXreset').addClass('hidden');
        addToFilterList('delete');
        for(var i = 0; i < columns.length; i++) {
            colorElments(columns[i]);
        }
        firstClickReg = true;
        return false;
    });

    $('#regXreset').on('click', function() {
        $('.regX').removeClass('regX');
        $('#regXdelete, #regXreset').addClass('hidden');
        for(var i = 0; i < columns.length; i++) {
            colorElments(columns[i]);
        }
        firstClickReg = true;
        return false;
    });

    $('#regXpotIt').on('click', function() {
        $('.regX').removeClass('regX');
        $('#regXdelete, #regXreset').addClass('hidden');
        addToFilterList('potit');
        firstClickReg = true;
        potIt($('#regXcat').val(), $('#regX').val());
        return false;
    });

    function addToFilterList(which) {
        if(which == 'delete' && $('#deletelist').html() == '') {
            $('#deletelist').append('<span class="title">Deleted: </span><span>in ' + $('#regXcat').val() + ': ' + '"' + $('#regX').val() + '"</span>');
        } else if(which == 'delete') {
            $('#deletelist').html($('#deletelist').html() + '<span>in ' + $('#regXcat').val() + ': ' + '"' + $('#regX').val() + '"</span>');
        }

        if(which == 'potit' && $('#potitlist').html() == '') {
            $('#potitlist').append('<span class="title">Binned: </span><span>in ' + $('#regXcat').val() + ': ' + '"' + $('#regX').val() + '"</span>');
        } else if(which == 'potit') {
            $('#potitlist').html($('#potitlist').html() + '<span>in ' + $('#regXcat').val() + ': ' + '"' + $('#regX').val() + '"</span>');
        }
    }

});

function init() {
    
    var zeitAktuell, zeitVorher = '00';
    for(var i = 0; i < host.length; i++) {
         zeitAktuell = zeit[i].substr(0,2);

        if(i == 0) {
            $(wrapper).append('<div class="timeseperator first"><div class="label">' + zeitAktuell + '</div></div>');
        }
        if(zeitAktuell != zeitVorher) {
            $(wrapper).append('<div class="timeseperator"><div class="label">' + zeitAktuell + '</div></div>');
        }
        zeitVorher = zeitAktuell;
        $(wrapper).append('<div class="logline" title="' + zeit[i] + ' · ' + host[i] + ' · ' + country[i] + ' · ' + responsecode[i] + ' · ' + method[i] + ' · ' + url[i] + '" data-linenumber="' + i + '" data-title="' + country[i] + ' ' + responsecode[i] + ' ' + url[i] + '" data-logip="' + country[i] + ' ' + responsecode[i] + '" data-loguser="' + country[i] + ' ' + url[i] + '" data-ipuser="' + responsecode[i] + ' ' + url[i] + '" data-url="' + url[i] + '"  data-ip="' + country[i] + '"  data-responsecode="' + responsecode[i] + '"><div class="' + columns[0] + '" data-title="' + country[i] + '" data-ip="' + country[i] + '"></div><div class="' + columns[1] + '" data-title="' + responsecode[i] + '" data-responsecode="' + responsecode[i] + '"></div><div class="' + columns[2] + '" data-title="' + url[i] + '" data-url="' + url[i] + '"></div></div>');
    }

    var hostcheck = $('#hostCheck');
    var responsecodeCheck = $('#responsecodeCheck');
    var urlCheck = $('#urlCheck');
    var logmessageText;

    $('.logline').on('mouseover', function() {
        logmessageText = 
            $(this).prev().prev().prev().prev().attr('title') + '<br>' + 
            $(this).prev().prev().prev().attr('title') + '<br>' + 
            $(this).prev().prev().attr('title') + '<br>' + 
            $(this).prev().attr('title') + '<br>' + 
            '<span>' + $(this).attr('title') + '</span><br>' + 
            $(this).next().attr('title') + '<br>' + 
            $(this).next().next().attr('title') + '<br>' + 
            $(this).next().next().next().attr('title') + '<br>' + 
            $(this).next().next().next().next().attr('title');
        $(logText).html(logmessageText);

        if(hostcheck.is(':checked') && !responsecodeCheck.is(':checked') && !urlCheck.is(':checked')) {
            $(this).parent().find('[data-title="' + $(this).find('.country').attr('data-title') + '"]').parent().addClass('same');
        }
        if(!hostcheck.is(':checked') && responsecodeCheck.is(':checked') && !urlCheck.is(':checked')) {
            $(this).parent().find('[data-title="' + $(this).find('.responsecode').attr('data-title') + '"]').parent().addClass('same');
        }
        if(!hostcheck.is(':checked') && !responsecodeCheck.is(':checked') && urlCheck.is(':checked')) {
            $(this).parent().find('[data-title="' + $(this).find('.url').attr('data-title') + '"]').parent().addClass('same');
        }

        if(hostcheck.is(':checked') && responsecodeCheck.is(':checked') && !urlCheck.is(':checked')) {
            $(this).parent().find('[data-logip="' + $(this).attr('data-logip') + '"]').addClass('same');
        }
        if(hostcheck.is(':checked') && !responsecodeCheck.is(':checked') && urlCheck.is(':checked')) {
            $(this).parent().find('[data-loguser="' + $(this).attr('data-loguser') + '"]').addClass('same');
        }
        if(!hostcheck.is(':checked') && responsecodeCheck.is(':checked') && urlCheck.is(':checked')) {
            $(this).parent().find('[data-ipuser="' + $(this).attr('data-ipuser') + '"]').addClass('same');
        }

        if(hostcheck.is(':checked') && responsecodeCheck.is(':checked') && urlCheck.is(':checked')) {
            $(this).parent().find('[data-title="' + $(this).attr('data-title') + '"]').addClass('same');
        }

        countryPixel.css('background-color', $(this).find('.country').css('background-color'));
        responsecodePixel.css('background-color', $(this).find('.responsecode').css('background-color'));
        urlPixel.css('background-color', $(this).find('.url').css('background-color'));

    });

    var pixelLegend = $('#pixelLegend');
    var countryPixel = $('#countryPixel');
    var responsecodePixel = $('#responsecodePixel');
    var urlPixel = $('#urlPixel');
    
    wrapper.on('mouseout', function() {
        countryPixel.css('background-color', 'transparent');
        responsecodePixel.css('background-color', 'transparent');
        urlPixel.css('background-color', 'transparent');
    });

    $('.logline').on('click', function() {

        if(hostcheck.is(':checked') && !responsecodeCheck.is(':checked') && !urlCheck.is(':checked')) {
            $(this).parent().find('[data-title="' + $(this).find('.country').attr('data-title') + '"]').parent().remove();
        }
        if(!hostcheck.is(':checked') && responsecodeCheck.is(':checked') && !urlCheck.is(':checked')) {
            $(this).parent().find('[data-title="' + $(this).find('.responsecode').attr('data-title') + '"]').parent().remove();
        }
        if(!hostcheck.is(':checked') && !responsecodeCheck.is(':checked') && urlCheck.is(':checked')) {
            $(this).parent().find('[data-title="' + $(this).find('.url').attr('data-title') + '"]').parent().remove();
        }

        if(hostcheck.is(':checked') && responsecodeCheck.is(':checked') && !urlCheck.is(':checked')) {
            $(this).parent().find('[data-logip="' + $(this).attr('data-logip') + '"]').remove();
        }
        if(hostcheck.is(':checked') && !responsecodeCheck.is(':checked') && urlCheck.is(':checked')) {
            $(this).parent().find('[data-loguser="' + $(this).attr('data-loguser') + '"]').remove();
        }
        if(!hostcheck.is(':checked') && responsecodeCheck.is(':checked') && urlCheck.is(':checked')) {
            $(this).parent().find('[data-ipuser="' + $(this).attr('data-ipuser') + '"]').remove();
        }

        if(hostcheck.is(':checked') && responsecodeCheck.is(':checked') && urlCheck.is(':checked')) {
            $(this).parent().find('[data-title="' + $(this).attr('data-title') + '"]').remove();
        }

        for(var i = 0; i < columns.length; i++) {
            colorElments(columns[i]);
        }

    });

    $('.logline').on('mouseout', function() {
        $('.logline').removeClass('same');
        $('.logline div').removeClass('same');
    });

    $(wrapper).on('mouseout', function() {
        $(logText).html(' ');
    });

    for(var i = 0; i < columns.length; i++) {
        colorElments(columns[i], true);
    }
    
    // Fade inn
    $(wrapper).addClass('active');
}

map = function(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))
};

function colorElments(elements, alpha) {
    // Count Elements in Array
    var titles = {};
    var title;
    var lowest = 9999;
    var biggest = 0;

    $('.' + elements).each(function(i, el) {
        if(!$(el).parent().hasClass('regX')) {
            title = $(el).attr('data-title');
            if (titles.hasOwnProperty(title)) {
                titles[title] += 1;
            } else {
                titles[title] = 1;
            }
            if(titles[title] < lowest) { lowest = titles[title]; }
            if(titles[title] > biggest) { biggest = titles[title]; }
        }
    });

    $('#pixelLegend').find('.' + elements).find('.min').html(lowest);
    $('#pixelLegend').find('.' + elements).find('.max').html(biggest);
    
    // print results
    var classTemp;
    for(var key in titles) {
        classTemp = $('[data-title="' + key + '"]').attr('class');
        color = 'color-' + Math.round(map(titles[key], lowest, biggest, 0, 9));
        if(alpha == true) {
            $('[data-title="' + key + '"]').addClass(color).css('opacity', (Math.random() * (1 - .5) + .5));
        } else {
            $('[data-title="' + key + '"]').attr('class', classTemp + 'killed ' + color);
        }
        
    }
}


function colorRegEx(regXcat, regString) {
    if(regString != '') {
        // data-XYZ begins with string
        //$(wrapper).find('.logline[data-' + regXcat + '^="' + regString + '"]').addClass('regX');

        // data-XYZ has string in it
        if(regXcat = 'all') {
            $(wrapper).find('.logline div[data-title*="' + regString + '"]').parent().addClass('regX');
        } else {
            $(wrapper).find('.logline[data-' + regXcat + '*="' + regString + '"]').addClass('regX');
        }
        
        for(var i = 0; i < columns.length; i++) {
            colorElments(columns[i]);
        }
    }
}

function potIt(regXcat, regString) {
    if(regString != '') {

        if(regXcat = 'all') {
            $(wrapper).find('.logline div[data-title*="' + regString + '"]').attr('data-title', 'same').addClass('potted');
        } else {
            $(wrapper).find('.logline div[data-' + regXcat + '*="' + regString + '"]').attr('data-title', 'same').addClass('potted');
        }

        for(var i = 0; i < columns.length; i++) {
            colorElments(columns[i]);
        }
    }
}

