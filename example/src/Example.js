import { createElementWithContext } from 'fluxible-addons-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { TutorialNavigator, Tutorial, Breadcrumbs, TutorialStore, ArticleStore, InitialSettingsAction, ServiceName } from '../../src/App';
import Fluxible from 'fluxible';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import serviceProxyPlugin from 'fluxible-plugin-service-proxy';
import jsonp from 'jsonp';
import Q from 'q';

var service = function(payload){
  var defer = Q.defer();
  var paths = {
    'spa': 'client-platforms',
    'native-mobile': 'native-platforms',
    'webapp': 'server-platforms',
    'hybrid': 'native-platforms',
    'backend': 'server-apis'
  };

  var url = `${payload.baseUrl || ''}/${paths[payload.appType]}/` +
       `${payload.currentTech}?${payload.appType}=${payload.tech1}&e=1`;
  if(payload.tech2) {
   url += '&api=' + payload.tech2;
  }

  if(payload.clientId) {
   url += '&a=' + payload.clientId;
  }

  jsonp(url, {}, function(err, data){
    return defer.resolve(data.html);
  });

  return defer.promise;
};

class Application extends React.Component{
  render(){
    var view = <TutorialNavigator {...this.props}></TutorialNavigator>;
    if (this.props.appType && this.props.tech1 && this.props.tech2){
      view = (<div><Breadcrumbs {...this.props}></Breadcrumbs><TutorialView {...this.props}></TutorialView></div>);
    }
    return (
      <div>
          {view}
      </div>
    );
  }
}

Application.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

Application = provideContext(connectToStores(Application, [TutorialStore], (context, props) => {
  return context.getStore(TutorialStore).getState();
}));

class TutorialView extends React.Component{
  render(){
      var hasTutorial2 = this.props.tech2 && this.props.tech2;
      var tutorial2 = '';
      if (hasTutorial2 !== 'no-api'){
        tutorial2 = (<Tutorial appType={this.props.appType} tech={this.props.tech2} ></Tutorial>);
      }

      return (
      <div className="js-doc-template container">
          <div className="row">
            <div className="col-sm-9">
              <section className="docs-content">
                <ul className={'nav nav-tabs' + (hasTutorial2 ? '' : ' hide')}>
                  <li className="active"><a href="#tutorial-1" data-toggle="tab">{this.props.tech1}</a></li>
                  <li><a href="#tutorial-2" data-toggle="tab">{this.props.tech2}</a></li>
                </ul>
                <div className="tab-content">
                  <Tutorial tabName="tutorial-1"
                    default={true}
                    appType={this.props.appType}
                    tech={this.props.tech1} />
                  {tutorial2}
                </div>
              </section>
            </div>
          </div>
        </div>);
  }
}

TutorialView.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

TutorialView = provideContext(connectToStores(TutorialView, [TutorialStore], (context, props) => {
  return context.getStore(TutorialStore).getState();
}));


var app = new Fluxible({
    component: Application
});

app.plug(serviceProxyPlugin());
app.getPlugin('ServiceProxyPlugin').registerService(ServiceName, { loadArticle : service });
app.registerStore(TutorialStore);
app.registerStore(ArticleStore);

var context = app.createContext();

if (typeof window !== 'undefined'){
  window.React = React;
  window.Context = context;
}

var platforms = JSON.parse('{"apptypes":[{"title":"Native mobile app","name":"native-mobile","description":"An app that runs natively in devices","example":"eg: iOS SDK","budicon":243},{"title":"Single page app","name":"spa","description":"A JavaScript front-end app that uses an API","example":"eg: AngularJS + NodeJS","budicon":349},{"title":"Regular web app","name":"webapp","description":"Traditional web app (with refresh)","example":"eg: Java ASP.NET","budicon":378},{"title":"Hybrid mobile app","name":"hybrid","description":"A JS/HTML5 mobile app that runs in devices","example":"eg: PhoneGap Ionic","budicon":243},{"title":"Backend/API","name":"backend","description":"An API or service that does JWT validation","example":"eg: Custom API","budicon":649}],"clientPlatforms":[{"title":"Angular.js","name":"angularjs","url":"/client-platforms/angularjs","image":"/media/platforms/angular.png"},{"title":"EmberJS","name":"emberjs","url":"/client-platforms/emberjs","image":"/media/platforms/emberjs.png"},{"title":"jQuery","name":"jquery","url":"/client-platforms/jquery","image":"//upload.wikimedia.org/wikipedia/en/9/9e/JQuery_logo.svg"},{"title":"React","name":"react","url":"/client-platforms/react","image":"/media/platforms/react.png"},{"title":"Socket.io","name":"socket-io","url":"/client-platforms/socket-io","image":"/media/platforms/socketio.svg"},{"title":"Vanilla JS","name":"vanillajs","url":"/client-platforms/vanillajs","image":"/media/platforms/html5.png"}],"nativePlatforms":[{"title":"Android","name":"android","url":"/native-platforms/android","image":"/media/platforms/android.png","hybrid":false},{"title":"Cordova","name":"cordova","url":"/native-platforms/cordova","image":"/media/platforms/phonegap.png","hybrid":true},{"title":"Ionic","name":"ionic","url":"/native-platforms/ionic","image":"/media/platforms/phonegap.png","hybrid":true},{"title":"iOS - Objective C","name":"ios-objc","url":"/native-platforms/ios-objc","image":"/media/platforms/ios.png","hybrid":false},{"title":"iOS - React Native","name":"ios-reactnative","url":"/native-platforms/ios-reactnative","image":"/media/platforms/react.png","hybrid":true},{"title":"iOS - Swift","name":"ios-swift","url":"/native-platforms/ios-swift","image":"/media/platforms/ios.png","hybrid":false},{"title":"Phonegap","name":"phonegap","url":"/native-platforms/phonegap","image":"/media/platforms/phonegap.png","hybrid":true},{"title":"Windows Phone","name":"windowsphone","url":"/native-platforms/windowsphone","image":"/media/platforms/windows-phone.png","hybrid":false},{"title":"Windows Store (C#)","name":"windows-store-csharp","url":"/native-platforms/windows-store-csharp","image":"/media/platforms/windows-8.png","hybrid":false},{"title":"Windows Store (JS)","name":"windows-store-javascript","url":"/native-platforms/windows-store-javascript","image":"/media/platforms/windows-8.png","hybrid":false},{"title":"WPF / Winforms","name":"wpf-winforms","url":"/native-platforms/wpf-winforms","image":"/media/platforms/asp.png","hybrid":false},{"title":"Xamarin","name":"xamarin","url":"/native-platforms/xamarin","image":"/media/platforms/xamarin.png","hybrid":false}],"hybridPlatforms":[{"title":"Cordova","name":"cordova","url":"/native-platforms/cordova","image":"/media/platforms/phonegap.png","hybrid":true},{"title":"Ionic","name":"ionic","url":"/native-platforms/ionic","image":"/media/platforms/phonegap.png","hybrid":true},{"title":"iOS - React Native","name":"ios-reactnative","url":"/native-platforms/ios-reactnative","image":"/media/platforms/react.png","hybrid":true},{"title":"Phonegap","name":"phonegap","url":"/native-platforms/phonegap","image":"/media/platforms/phonegap.png","hybrid":true}],"serverPlatforms":[{"title":"Apache","name":"apache","url":"/server-platforms/apache","image":"/media/platforms/apache.jpg"},{"title":"ASP Classic","name":"asp-classic","url":"/server-platforms/asp-classic","image":"/media/platforms/asp-classic.jpg"},{"title":"ASP.NET","name":"aspnet","url":"/server-platforms/aspnet","image":"/media/platforms/asp.png"},{"title":"ASP.NET (OWIN)","name":"aspnet-owin","url":"/server-platforms/aspnet-owin","image":"/media/platforms/asp.png"},{"title":"Go","name":"golang","url":"/server-platforms/golang","image":"/media/platforms/golang.png"},{"title":"Java","name":"java","url":"/server-platforms/java","image":"/media/platforms/java.png"},{"title":"NancyFX","name":"nancyfx","url":"/server-platforms/nancyfx","image":"/media/platforms/nancyfx.png"},{"title":"Node.js","name":"nodejs","url":"/server-platforms/nodejs","image":"/media/platforms/node.png"},{"title":"PHP","name":"php","url":"/server-platforms/php","image":"/media/platforms/php.png"},{"title":"PHP (Laravel)","name":"laravel","url":"/server-platforms/laravel","image":"/media/platforms/php.png"},{"title":"PHP (Symfony)","name":"symfony","url":"/server-platforms/symfony","image":"/media/platforms/php.png"},{"title":"Play 2 Scala","name":"scala","url":"/server-platforms/scala","image":"/media/platforms/play.png"},{"title":"Python","name":"python","url":"/server-platforms/python","image":"/media/platforms/python.png"},{"title":"Ruby On Rails","name":"rails","url":"/server-platforms/rails","image":"/media/platforms/rails.png"},{"title":"ServiceStack","name":"servicestack","url":"/server-platforms/servicestack","image":"/media/platforms/service-stack.png"}],"serverApis":[{"title":".NET WCF","name":"wcf-service","url":"/server-apis/wcf-service","image":"/media/platforms/wcf.png","thirdParty":false},{"title":"ASP.NET Web API","name":"aspnet-webapi","url":"/server-apis/aspnet-webapi","image":"/media/platforms/asp.png","thirdParty":false},{"title":"ASP.NET Web API (OWIN)","name":"webapi-owin","url":"/server-apis/webapi-owin","image":"/media/platforms/asp.png","thirdParty":false},{"title":"AWS","name":"aws","url":"/server-apis/aws","image":"/media/addons/aws.svg","thirdParty":true},{"title":"Azure Blob Storage","name":"azure-blob-storage","url":"/server-apis/azure-blob-storage","image":"/media/platforms/azure.png","thirdParty":true},{"title":"Azure Mobile Services","name":"azure-mobile-services","url":"/server-apis/azure-mobile-services","image":"/media/platforms/azure.png","thirdParty":true},{"title":"Azure Service Bus","name":"azure-sb","url":"/server-apis/azure-sb","image":"/media/platforms/azure.png","thirdParty":true},{"title":"Falcor API","name":"falcor","url":"/server-apis/falcor","image":"/media/platforms/falcor.png","thirdParty":false},{"title":"Firebase","name":"firebase","url":"/server-apis/firebase","image":"/media/addons/firebase.svg","thirdParty":true},{"title":"Go","name":"golang","url":"/server-apis/golang","image":"/media/platforms/golang.png","thirdParty":false},{"title":"Java API","name":"java","url":"/server-apis/java","image":"/media/platforms/java.png","thirdParty":false},{"title":"Nginx API","name":"nginx","url":"/server-apis/nginx","image":"/media/platforms/nginx.png"},{"title":"Node.js API","name":"nodejs","url":"/server-apis/nodejs","image":"/media/platforms/node.png","thirdParty":false},{"title":"PHP (Laravel) API","name":"php-laravel","url":"/server-apis/php-laravel","image":"/media/platforms/php.png","thirdParty":false},{"title":"PHP (Symfony) API","name":"php-symfony","url":"/server-apis/php-symfony","image":"/media/platforms/php.png","thirdParty":false},{"title":"PHP API","name":"php","url":"/server-apis/php","image":"/media/platforms/php.png","thirdParty":false},{"title":"Python API","name":"python","url":"/server-apis/python","image":"/media/platforms/python.png","thirdParty":false},{"title":"Relay API","name":"relay","url":"/server-apis/relay","image":"/media/platforms/relay.png","thirdParty":false},{"title":"Ruby API","name":"ruby","url":"/server-apis/ruby","image":"/media/platforms/rails.png","thirdParty":false},{"title":"Ruby On Rails API","name":"rails","url":"/server-apis/rails","image":"/media/platforms/rails.png","thirdParty":false},{"title":"Salesforce","name":"salesforce","url":"/server-apis/salesforce","image":"/media/addons/salesforce.svg","thirdParty":true},{"title":"Salesforce (sandbox)","name":"salesforce-sandbox","url":"/server-apis/salesforce-sandbox","image":"/media/addons/salesforce_sandbox_api.svg","thirdParty":true},{"title":"SAP OData","name":"sap-odata","url":"/server-apis/sap-odata","image":"/media/addons/sap_api.svg","thirdParty":true},{"title":"Spring Security Java API","name":"java-spring-security","url":"/server-apis/java-spring-security","image":"/media/platforms/java.png","thirdParty":false}]}');
context.getActionContext().executeAction(InitialSettingsAction, {
  quickstart: platforms,
  baseUrl: 'http://localhost:5050'
}).then(() => {
  ReactDOM.render(
      createElementWithContext(window.Context),
      document.getElementById('app')
  );
});
