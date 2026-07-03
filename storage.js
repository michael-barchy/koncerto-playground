var storage = [
    'https://cdn.jsdelivr.net/gh/michael-barchy/koncerto@main/koncerto.php',
    'https://cdn.jsdelivr.net/gh/Skrol29/tinybutstrong@master/tbs_class.php',
    'bootstrap.php',
    'src/Controller/HomeController.php',
    'templates/_menu.tbs.html',
    'templates/home.tbs.html'
];

var proxy = ['localhost', '127.0.0.1'].includes(location.hostname) ? 'source.php?file=' : 'https://cdn.jsdelivr.net/gh/michael-barchy/koncerto-playground@main';

var files = storage.map(function(file) {
    var fileName = file.substring(file.lastIndexOf('/') + 1);
    var filePath = file.startsWith('https:') ? '' : file.substring(0, file.lastIndexOf('/'));
    var fileUrl = file.startsWith('https:') ? file : `${proxy}/${file}`;
    return {
        name: fileName,
        parent: '/preload/' + filePath,
        url: fileUrl
    }
});
