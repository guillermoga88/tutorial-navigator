import React from 'react';
import ArticleStore from '../stores/ArticleStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';

class Tutorial extends React.Component {
  componentDidMount () {
    this.initClient();
  }
  componentDidUpdate() {
    this.initClient();
  }
  initClient(html) {
    if (typeof document !== 'undefined') {
      if (this.props.componentLoadedInBrowser){
        this.props.componentLoadedInBrowser.call(this);
      }
      var article = this.refs.article;
      if (article) {
        var child = article.firstChild;
        if (child.nodeName === 'H1' || child.nodeName === 'H2') {
          child.classList.add('hide');
        }
      }
    }
  }
  createMarkup() {
    return {__html: this.props.articleHtml};
  }
  render() {
    if (this.props.articleHtml) {
      return (
        <div id={this.props.tabName}
          className={'tab-pane' + (this.props.default ? ' active' : '')}
          dangerouslySetInnerHTML={this.createMarkup()}
          ref="article" />
      );
    } else {
      return (
          <div id={this.props.tabName} className='loading-tutorial'>
            <div className='auth0-spinner'>
              <div className='spinner'></div>
            </div>
          </div>
      );
    }
  }
}

Tutorial.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

Tutorial = connectToStores(Tutorial, [ArticleStore], (context, props) => ({
  articleHtml: context.getStore(ArticleStore).getArticleHtml(props.appType, props.tech)
}));

export default Tutorial;
