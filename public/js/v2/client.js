var ScheduleBox = React.createClass({
  componentDidMount: function () {
    function normalizeUrl(uri) {
      var parser = document.createElement('a');
      parser.href = uri;
      var out = parser.hostname;
      if (parser.port != '80') {
        out += ':' + parser.port;
      }
      return out;
    }

    this.socket = io(normalizeUrl(document.location.href));
    this.socket.on('disconnect', function () {
      console.log('disconnect fired.');
    });
    this.socket.on('connect', function () {
      console.log('connect fired.');
    });
    this.socket.on('error', function (error) {
      console.error(error);
    });
  },
  componentWillUnmount: function () {
    this.socket.close();
  },
  render: function () {
    var menuItems = [
      {name: 'Acts', href: '/acts'},
      {name: 'Stats', href: '/stats'}
    ];
    return (
      <div className="schedule-box">
        <div className="page-header">
          <h1>Baby scheduler v0.1.1</h1>
        </div>
        <div id="main-menu" className="navbar navbar-default" role="navigation">
          <div className="container-fluid">
            <div className="collapse navbar-collapse navbar-menubuilder">
              <MainMenuItems items={menuItems} active={0}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var MainMenuItems = React.createClass({
  getInitialState: function () {
    return {
      active: this.props.active
    };
  },
  handleMenuItemClick: function (index) {
    var MainMenuItems = this;

    return function (e) {
      e.preventDefault();

      MainMenuItems.setState({
        active: index
      });
    };
  },
  render: function () {
    var MainMenuItems = this;

    var items = this.props.items.map(function (item, index) {
      var className = '';
      if (index == MainMenuItems.state.active) {
        className = 'active';
      }
      return (
        <li className={className} key={index}>
          <a
            onClick={MainMenuItems.handleMenuItemClick(index, MainMenuItems.props)}
            href={item.href}>
            {item.name}
          </a>
        </li>
      )
    });

    return (
      <ul className="nav navbar-nav navbar-left">
        {items}
      </ul>
    )
  }
});

ReactDOM.render(
  <ScheduleBox/>,
  document.getElementById('content')
);
