examples.forEach(function(e) {
    storage.push('examples/' + e + '/config.json');
    storage.push('examples/' + e + '/db.sqlite');
    storage.push('examples/' + e + '.phar');
});

var proxy = ['localhost', '127.0.0.1'].includes(location.hostname) ? '/source.php?file=' : 'https://cdn.jsdelivr.net/gh/michael-barchy/koncerto-playground@1ce1b6894bbd149864e0193f1def9604e6b9b2ea';

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

if (0 === files.filter((f) => 'koncerto.php' === f.name).length) {
    files.push({
        name: 'koncerto.php',
        parent: '/preload/',
        url: '/source.php?file=/../koncerto/koncerto.php'
    });
}
