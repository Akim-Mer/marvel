import styled from "styled-components";

const widthStyle = {
	width: '180px',
	margin: '0 auto'
}

const ErrorMessage = () => {
	return (
		<img style={widthStyle} src = {process.env.PUBLIC_URL + '/error.gif'} />
	)
}



export default ErrorMessage;