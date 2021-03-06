import React from 'react';
import navigateAction from '../action/navigate-action';
import TutorialStore from '../stores/tutorial-store';
import {connectToStores} from 'fluxible-addons-react';
import _ from 'lodash';

class Breadcrumbs extends React.Component {
  
  handleClick(params) {
    let action = this.props.customNavigationAction || navigateAction;
    let payload = {};
    if (params.quickstart) payload.quickstartId = params.quickstart.name;
    if (params.platform)   payload.platformId   = params.platform.name;
    if (params.article)    payload.articleId    = params.article.name;
    this.context.executeAction(action, payload);
  }
  
  render() {
    let crumbs = [];
    let {quickstart, platform, article, isRestricted} = this.props;
    let index = 1;
    
    if (!quickstart) {
      return <div />;
    }
    
    // If we're running in "restricted" mode (eg. in the management site),
    // we're locked into a specific appType, and we don't want to display the
    // top-level Documentation link.
    if (isRestricted) {
      crumbs.push(
        <div itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
          <a itemProp="item" key="quickstart" onClick={this.handleClick.bind(this, {quickstart})}>
            <span className="text" itemProp="name">{quickstart.title}</span>
            <meta itemProp="position" content={index} />
          </a>
        </div>
      );
      index++;
    }
    else {
      crumbs.push(
        <div itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
          <a itemProp="item" key="base" onClick={this.handleClick.bind(this, {})}>
            <span className="text" itemProp="name">Documentation</span>
            <meta itemProp="position" content={index} />
          </a>
        </div>
      );
      index++;
      crumbs.push(<i className="icon-budicon-461"></i>);
      crumbs.push(
        <div itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
          <a itemProp="item" key="quickstart" onClick={this.handleClick.bind(this, {quickstart})}>
            <span className="text" itemProp="name">{quickstart.title}</span>
            <meta itemProp="position" content={index} />
          </a>
        </div>
      );
      index++;
    }
    
    if (platform) {
      crumbs.push(<i className="icon-budicon-461"></i>);
      crumbs.push(
        <div itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
          <a itemProp="item" key="platform" onClick={this.handleClick.bind(this, {quickstart, platform})}>
            <span className="text" itemProp="name">{platform.title}</span>
            <meta itemProp="position" content={index} />
          </a>
        </div>
      );
      index++;
      if (article && platform.articles.length > 1) {
        crumbs.push(<i className="icon-budicon-461"></i>);
        crumbs.push(
          <div itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
            <a itemProp="item" key="article" onClick={this.handleClick.bind(this, {quickstart, platform, article})}>
              <span className="text" itemProp="name">{article.title}</span>
              <meta itemProp="position" content={index} />
            </a>
          </div>
        );
        index++;
      }
    }
    
    return <div className="breadcrumbs" itemScope itemType="http://schema.org/BreadcrumbList">{crumbs}</div>;
  }
  
}

Breadcrumbs.propTypes = {
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object,
  article: React.PropTypes.object,
  isRestricted: React.PropTypes.bool,
  customNavigationAction: React.PropTypes.func
}

Breadcrumbs.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
};

Breadcrumbs = connectToStores(Breadcrumbs, [TutorialStore], (context, props) => {
  let store = context.getStore(TutorialStore);
  return {
    quickstart: store.getCurrentQuickstart(),
    platform: store.getCurrentPlatform(),
    article: store.getCurrentArticle(),
    isRestricted: store.getRestricted()
  };
});

export default Breadcrumbs;
