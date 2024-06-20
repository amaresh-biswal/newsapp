import React, { Component } from 'react'

export class NewsItem extends Component {

    render() {
        let { title, description, imgUrl, newsUrl, author, date } = this.props;
        return (
            <div className='my-3'>
                <div className="card">
                    <img src={imgUrl} className="card-img-top" alt="Not available" />
                    <div className="card-body">
                        <a href={newsUrl} target='_blank' rel="noreferrer" style={{textDecoration:"none",color:"black"}}>
                            <h5 className="card-title">{title}</h5>
                            <p className="card-text">{description}</p>
                        </a>
                        <p className="card-text"><small className="text-muted">By {author} on {new Date(date).toGMTString()} </small></p>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsItem
