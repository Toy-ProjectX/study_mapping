/*eslint-disable no-undef*/
import React from "react";
import { Link } from "react-router-dom";
import Table from "./board/Table";
import MapHome from "./map/MapHome";
import { Navbar, Nav, Form, Button } from "react-bootstrap";

class TestHome extends React.Component {
    state = {
        isLogin: false,
    };

    /**
     * 로그인 할 경우 가입된 토큰이거나 이메일이 있을경우 회원 정보를 활용하여 로그인,
     * (카카오로 그냥 로그인할 경우 로그아웃이 안되는 문제가 있음... 망할 아니면 쿠키를 지워서 강제로 로그아웃을 시킬 수 있음....)
     * 없을경우 user에서 이메일, 성별, 토큰을 가져와 회원가입 시킨다.
     *
     *
     */

    loginWithKakao = () => {
        try {
            return new Promise((resolve, reject) => {
                if (!Kakao) {
                    reject("Kakao 인스턴스가 존재하지 않습니다.");
                }
                Kakao.Auth.login({
                    success: (auth) => {
                        console.log("정상적으로 로그인 되었습니다.", auth);
                        this.setState({
                            isLogin: true,
                        });
                    },
                    fail: (err) => {
                        console.error(err);
                    },
                });
            });
        } catch (err) {
            console.error(err);
        }
    };

    logoutWithKakao = () => {
        if (Kakao.Auth.getAccessToken()) {
            console.log(
                "카카오 인증 액세스 토큰이 존재합니다.",
                Kakao.Auth.getAccessToken()
            );
            Kakao.Auth.logout(() => {
                console.log(
                    "로그아웃 되었습니다.",
                    Kakao.Auth.getAccessToken()
                );
                this.setState({
                    isLogin: false,
                });
            });
        }
    };
    componentDidMount() {
        console.log("componentDidMount 가 실행되었습니다.");
        Kakao.init("b7c5cb9042af5754b5af32fa54b1a96e");
        if (Kakao.Auth.getAccessToken()) {
            console.log("액세스 토큰이 존재합니다. 세션을 유지합니다.");
            this.setState({
                isLogin: true,
            });
        }
    }

    render() {
        const { isLogin } = this.state;

        console.log(this.props);

        const loginView = (
            <div>
                <Button
                    variant="outline-info"
                    className="mr-2"
                    onClick={this.loginWithKakao}
                >
                    로그인
                </Button>
                <Button variant="outline-info">회원가입</Button>
            </div>
        );

        const mainView = (
            <div>
                <Button
                    variant="outline-info"
                    className="mr-2"
                    onClick={this.logoutWithKakao}
                >
                    로그아웃
                </Button>
                <Button variant="outline-info">내정보</Button>
            </div>
        );

        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/" className="pt-3">
                        StudyMatching
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/Table">게시판</Nav.Link>
                        <Nav.Link href="/MapHome">지도보기</Nav.Link>
                    </Nav>
                    <Form inline>{isLogin ? mainView : loginView}</Form>
                </Navbar>
            </div>
        );
    }
}

export default TestHome;
