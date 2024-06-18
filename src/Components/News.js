import React, { Component } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';

export class News extends Component {
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static defaultProps = {
    country: 'in',
    category: 'general',
  };

  static propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      searchKeyword: '',
      filteredArticles: [],
      allArticles: [],
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMania`;
  }

  async fetchAllArticles(page = 1, accumulatedArticles = []) {
    this.setState({ loading: true });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=25a2d5c69a7b49569d539cb15bb35edd&page=${page}&pageSize=9`;
    let data = await fetch(url);
    let parsedData = await data.json();
    const newArticles = accumulatedArticles.concat(parsedData.articles);
    if (page < Math.ceil(parsedData.totalResults / 9)) {
      this.fetchAllArticles(page + 1, newArticles);
    } else {
      this.setState({
        loading: false,
        articles: newArticles,
        filteredArticles: newArticles,
        allArticles: newArticles,
      });
    }
  }

  async componentDidMount() {
    this.props.setProgress(10);
    await this.fetchAllArticles();
    this.props.setProgress(100);
  }

  handlePrevClk = async () => {
    this.props.setProgress(10);
    this.setState({ page: this.state.page - 1 });
    this.props.setProgress(100);
  };

  handleNxtClk = async () => {
    this.props.setProgress(10);
    this.setState({ page: this.state.page + 1 });
    this.props.setProgress(100);
  };

  handleSearch = (event) => {
    event.preventDefault();
    const filteredArticles = this.state.allArticles.filter((article) =>
      article.title.toLowerCase().includes(this.state.searchKeyword.toLowerCase())
    );
    this.setState({ filteredArticles });
  };

  handleInputChange = (event) => {
    this.setState({ searchKeyword: event.target.value });
  };

  render() {
    const { page, filteredArticles, loading } = this.state;
    const pageSize = 9;
    const displayedArticles = filteredArticles.slice((page - 1) * pageSize, page * pageSize);

    return (
      <div className="container my-3">
        <h1 className="text-center" style={{ marginTop: '60px' }}>
          NewsMania - Top {this.capitalizeFirstLetter(this.props.category)} News
        </h1>
        <form className="d-flex my-4" onSubmit={this.handleSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search by Title"
            aria-label="Search"
            value={this.state.searchKeyword}
            onChange={this.handleInputChange}
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <div className="row my-2">
          {!loading &&
            displayedArticles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ''}
                    description={element.description ? element.description : ''}
                    author={element.author ? element.author : 'Unknown'}
                    date={element.publishedAt}
                    imgUrl={element.urlToImage ? element.urlToImage : 'data:image/jpeg;base64,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'}
                    newsUrl={element.url}
                  />
                </div>
              );
            })}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            type="button"
            disabled={page <= 1}
            className="btn btn-success"
            onClick={this.handlePrevClk}
          >
            &larr; Previous
          </button>
          <button
            type="button"
            disabled={page * pageSize >= filteredArticles.length}
            className="btn btn-success"
            onClick={this.handleNxtClk}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
