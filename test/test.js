var assert = require('assert');
var mehdown = require('../lib');

describe('newlines', function() {
    it('\\n', function() {
        var text = mehdown.parse('a\nb\nc\n');
        assert.equal(text, 'a<br />b<br />c');
    });

    it('\\r\\n', function() {
        var text = mehdown.parse('a\r\nb\r\nc\r\n');
        assert.equal(text, 'a<br />b<br />c');
    });

    it('<li>', function() {
        var text = mehdown.parse('<ul>\r\n<li>a</li>\r\n<li>b</li>\r\n<li>c</li>\r\n</ul>');
        assert.equal(text, '<ul><li>a</li><li>b</li><li>c</li></ul>');
    });

    it('<blockquote>', function() {
        var text = mehdown.parse('<blockquote>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit\nLorem ipsum dolor sit amet, consectetur adipisicing elit\nLorem ipsum</p>\n\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit\nLorem ipsum dolor sit amet, consectetur adipisicing elit</p>\n</blockquote>');
        assert.equal(text, '<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit Lorem ipsum dolor sit amet, consectetur adipisicing elit Lorem ipsum</p>\n\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit Lorem ipsum dolor sit amet, consectetur adipisicing elit</p></blockquote>');
    });
});

describe('anchors', function() {
    it('rel attributes', function() {
        var text = mehdown.parse('<p><a rel="abc" href="http://www.google.com">Google</a></p>');
        assert.equal(text, '<p><a rel="nofollow" target="_blank" href="http://www.google.com">Google</a></p>');
    });

    it('target attributes', function() {
        var text = mehdown.parse('<p><a target="abc" href="http://www.google.com">Google</a></p>');
        assert.equal(text, '<p><a rel="nofollow" target="_blank" href="http://www.google.com">Google</a></p>');
    });

    it('local href', function() {
        var text = mehdown.parse('<p><a href="/path">path</a></p>');
        assert.equal(text, '<p><a href="/path">path</a></p>');
    });

    it('localhost href', function() {
        var text = mehdown.parse('<p><a href="http://localhost:8000/path">path</a></p>');
        assert.equal(text, '<p><a href="http://localhost:8000/path">path</a></p>');
    });

    it('mediocre href', function() {
        var text = mehdown.parse('<p><a href="https://mediocre.com/path">path</a></p>');
        assert.equal(text, '<p><a href="https://mediocre.com/path">path</a></p>');
    });
});

describe('strikethrough', function() {
    it('~~', function() {
        var text = mehdown.parse('<p>~~strikethrough~~</p>');
        assert.equal(text, '<p><s>strikethrough</s></p>');
    });
});

describe('usernames', function() {
    it('@username', function() {
        var text = mehdown.parse('@username');
        assert.equal(text, '<a href="http://localhost:8000/@username">@username</a>');
    });

    it('abc @username 123', function() {
        var text = mehdown.parse('abc @username 123');
        assert.equal(text, 'abc <a href="http://localhost:8000/@username">@username</a> 123');
    });

    it('abc @username1 notausername@notausername @username2 123', function() {
        var text = mehdown.parse('abc @username1 notausername@notausername @username2 123');
        assert.equal(text, 'abc <a href="http://localhost:8000/@username1">@username1</a> notausername@notausername <a href="http://localhost:8000/@username2">@username2</a> 123');
    });
});

describe('spoilers', function() {
    it('[spoiler]Hello[/spoiler]', function() {
        var text = mehdown.parse('<p>[spoiler]Hello[/spoiler]</p>');
        assert.equal(text, '<p><span class="spoiler">Hello</span></p>');
    });

    it('[spoiler]Hello[/spoiler] [spoiler]World[/spoiler]', function() {
        var text = mehdown.parse('<p>[spoiler]Hello[/spoiler] [spoiler]World[/spoiler]</p>');
        assert.equal(text, '<p><span class="spoiler">Hello</span> <span class="spoiler">World</span></p>');
    });
});

describe('SoundCloud URLs', function() {
    it('https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town', function() {
        var text = mehdown.parse('<p><a href="https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town">https://soundcloud.com/shawnmichaelmiller/santa-claus-is-coming-to-town</a></p>');
        assert.equal(text, '<p><iframe class="soundcloud" frameborder="0" src="https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fshawnmichaelmiller%2Fsanta-claus-is-coming-to-town"></iframe></p>')
    });
});

describe('Twitter Status URLs', function() {
    it('https://twitter.com/mediocrelabs/status/410516133955907584', function() {
        var text = mehdown.parse('<p><a href="https://twitter.com/mediocrelabs/status/410516133955907584">https://twitter.com/mediocrelabs/status/410516133955907584</a></p>');
        assert.equal(text, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/mediocrelabs/status/410516133955907584"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
    });

    it('https://twitter.com/_/status/416050320272551936', function() {
        var text = mehdown.parse('<p><a href="https://twitter.com/_/status/416050320272551936">https://twitter.com/_/status/416050320272551936</a></p>');
        assert.equal(text, '<p><blockquote class="twitter-tweet" lang="en"><a href="https://twitter.com/_/status/416050320272551936"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></p>');
    });
});

describe('Vimeo URLs', function() {
    it('http://vimeo.com/78950165', function() {
        var text = mehdown.parse('<p><a href="http://vimeo.com/78950165">http://vimeo.com/78950165</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="vimeo" frameborder="0" src="//player.vimeo.com/video/78950165"></iframe></p>');
    });
});

describe('Vine URLs', function() {
    it('https://vine.co/v/hWZ9mbJZaKE', function() {
        var text = mehdown.parse('<p><a href="https://vine.co/v/hWZ9mbJZaKE">https://vine.co/v/hWZ9mbJZaKE</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="vine" frameborder="0" src="//vine.co/v/hWZ9mbJZaKE/embed/simple"></iframe></p>');
    });
});

describe('YouTube URLs', function() {
    it('http://www.youtube.com/watch?v=kU9MuM4lP18', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?v=kU9MuM4lP18">http://www.youtube.com/watch?v=kU9MuM4lP18</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/kU9MuM4lP18"></iframe></p>');
    });

    it('http://www.youtube.com/watch?v=kU9MuM4lP18 http://www.youtube.com/watch?v=eGDBR2L5kzI', function() {
        var text = mehdown.parse('<p><a href="http://www.youtube.com/watch?v=kU9MuM4lP18">http://www.youtube.com/watch?v=kU9MuM4lP18</a><br /><a href="http://www.youtube.com/watch?v=eGDBR2L5kzI">http://www.youtube.com/watch?v=eGDBR2L5kzI</a></p>');
        assert.equal(text, '<p><iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/kU9MuM4lP18"></iframe><br /><iframe allowfullscreen class="youtube" frameborder="0" src="//www.youtube.com/embed/eGDBR2L5kzI"></iframe></p>');
    });
});