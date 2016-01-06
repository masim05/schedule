var socket = io.connect('http://localhost:3000/');
socket.on('error', function (error) {
  console.log('Error on socket', error);
});
socket.on('refreshActs', function(data){
	console.log('refreshActs', data);
});

var ActBox = React.createClass({});
var ActList = React.createClass({
	getInitialState: function() {
		return {
			acts:[]
		}
	},
	componentDidMount: function() {
		socket.on('refreshActs', function(data) {
			console.log('refreshActs', data);
			this.setState(data);
		}.bind(this));
	},
	render: function() {
	return (
		<div className="actList">
		<h1>Acts</h1>
		</div>
	);
}
});
var ActForm = React.createClass({});

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('content')
);
