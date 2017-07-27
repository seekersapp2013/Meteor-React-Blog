import React, { Component } from 'react';
import Resp from '../../imports/api/blogs.js'
import {Router, Route, IndexRoute, browserHistory } from 'react-router'
import {Paper} from 'material-ui'
import {Link} from 'react-router-dom'


import { createContainer } from 'react-meteor-data'


import PropTypes from 'prop-types'
import { Posts } from '../../imports/api/blogs.js'

import Image from '../components/Image.jsx'
import BigStoryLoader from '../components/BigStoryLoader.jsx'

// App component - represents the whole app

class Home extends Component {
	constructor(props){
		super(props)
		this.state={
			numberOfImagesLoaded :0,
		}
	}
	renderPosts(){
		let blogs = this.props.posts;
		// Map of the 6 latest blog postsloaded in Apps jsx only way to do it otherwise you get an empty array at first shot and everything shuts down
		return blogs.map((blog, index)=>{
			var linkTo = "blog/"+ blog.slug
			let content = {
				title: blog.title,
				image: blog.featuredImage.fields.file.url||'no-image',
				author: blog.author[0].fields.name,
				created: blog.created,
				tags: blog.tags,
				summary:blog.summary,
				body: blog.body,
				slug: blog.slug
			}
			return (
				<Link  key={index} imageLoaded={this.imageLoaded()} className="home-left"to={{pathname: linkTo, 
					state: content}}  
				style={{textDecoration: 'none', color: 'white'}}>
					<Paper>

					<Image src={blog.featuredImage.fields.file.url}/>
					 <h1>{blog.title}</h1>
					</Paper>
				</Link>
				) 
		})
	}
	imageLoaded(){
		this.setState({numberOfImagesLoaded : this.state.numberOfImagesLoaded+1});
		console.log(this.state.numberOfImagesLoaded);
	}

	componentWillMount(){
		// let bar = this.getPosts(Resp).then(()=>console.log(bar))
		console.log(this.props.dataReady)
	}
	displayBigStoryLoader(){
		return (this.state.numberOfImagesLoaded >=4)? '': 
			<BigStoryLoader/>

	}
	render(){
		// console.log(this.state.numberOfImagesLoaded)
		return (
			<div>
				<div className="container">
					 <div className="home-header">
					 {this.renderPosts()}
					 </div>
				</div>
				{this.displayBigStoryLoader()}
			</div>
		)
	
	}
}

export default createContainer(()=>{
	let handle = Meteor.subscribe('posts')
	if(handle.ready()){
		
	}
	return {
		posts: Posts.find({}, {limit: 6}).fetch(),
		dataReady: true
	}
},Home)
