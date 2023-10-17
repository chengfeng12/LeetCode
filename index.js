const fs = require('fs')

const rootPath = './src';
function readDir(path, callback) {
  fs.readdir(path, (err, data) => {
    if(err) {
      console.log('出错');
    } else {
      console.log("读取目录成功！");
      console.log(data);
      callback && callback(data)
      
    }
  })
}

const treeData = {}
// 开始读取
readDir(rootPath, (data) => {
  let dirPath = data;
  dirPath.forEach(path => {
    treeData[path] = []
    let tempPath = `${rootPath}/${path}`
    readDir(tempPath, (data) => {
      data = data.filter(name => name.includes('.html'))
      console.log(data, 'data');
      data.forEach(item => {
        treeData[path].push({
          label: item,
          link: `${tempPath}/${item}`
        })
      })
      console.log(treeData, 'treeData');
      
    })
  });
  // 开始写入文件
  writeRootFile(treeData)
});
// 读取文件内容
const readFileContent = (file, callback) => {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      console.log(`读取文件内容失败`);
    } else {
      callback && callback(data)
    }
  })
}
// 写 index.html 文件
const writeRootFile = (treeData) => {
  readFileContent(`./index.html`, (content) => {
    const createRecordHTML =  `
<script>
  let tree = document.getElementById('tree');
  let data = ${JSON.stringify(treeData)}
  let frag = document.createDocumentFragment()
  for (const key in data) {
    let uls = document.createElement('ul')
    if (data[key]) {
      data[key].forEach(item => {
        let lisChild = document.createElement('li')
        let link = document.createElement('a')
        link.href = item.link
        link.innerHTML = item.label
        lisChild.appendChild(link)
        uls.appendChild(lisChild)
      });
    }
    console.log(uls, 'uls');
    
    let preUls = document.createElement('ul')
    preUls.innerHTML = key;
    preUls.appendChild(uls)
    frag.appendChild(preUls);
  }
  tree.appendChild(frag);
</script>
`
    content = replaceScriptContent(content, createRecordHTML);
    // console.log(content, 'content');
    fs.writeFile(`./index.html`, content, (err, data) => {
      if (!err) {
        console.log('写入成功');
      }
      console.log(err, data);
    })
    
    
  })
  // fs.writeFile(`index.html`, )
}

function replaceScriptContent(input, text) {
  return input.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g, text);
}