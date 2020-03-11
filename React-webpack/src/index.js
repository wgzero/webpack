import React, { Component } from 'react'
import ReactDom from 'react-dom'

import axios from 'axios'

import './reset.css'

import zero from './zero.png'

import Child from './child.jsx'


import './index.less'

class App extends Component {

    componentDidMount(){
        axios.get('/react/api/header.json').then(res => {
            console.log('react-res---:', res)
        })
    }

    render(){
        return (
            <div>
                <h1>hello summer 123</h1>
                <Child />
                <img src={ zero } />
            </div>
        )
    }
}

ReactDom.render(<App /> ,document.getElementById('root'))