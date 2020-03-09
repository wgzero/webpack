// 1.scss
import './index.scss'
// 2.less
import './one.less'
// 3.file
import zero from  './zero.png'

var app =  document.getElementById('root')
app.innerHTML = `<button>hello world</button> <img src=`+ zero +` />`

console.log('hello webpack')

const handleClick = () => {
    alert(123)
}
handleClick()
