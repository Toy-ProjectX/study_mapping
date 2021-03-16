package com.example.demo.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/kakao")
public class KakaoController {

    @GetMapping(value = "oauth")
    public String kakaoConnect() {
        StringBuffer url = new StringBuffer();
        url.append("https://kauth.kakao.com/oauth/authorize?");
        url.append("client_id=70f226d66e071f75cb43a3f68f012f1d");
        url.append("&redirect_uri=http://localhost:8080/kakao/callback");
        url.append("&response_type=code");

        return "redirect:" + url.toString();
    }

    @RequestMapping(value = "/callback", produces = "application/json", method = {RequestMethod.GET, RequestMethod.POST})
    public String kakaoLogin(@RequestParam("code") String code, RedirectAttributes ra, HttpSession session, HttpServletResponse response, Model model) throws IOException {

        System.out.println("kakao code:" + code);
        JsonNode access_token = getKakaoAccessToken(code);
        System.out.println(access_token);

        return "redirect:/";
    }

    public JsonNode getKakaoAccessToken(String code) {
        final String RequestUrl = "https://kauth.kakao.com/oauth/token"; // Host
        final List<NameValuePair> postParams = new ArrayList<NameValuePair>();

        postParams.add(new BasicNameValuePair("grant_type", "authorization_code"));
        postParams.add(new BasicNameValuePair("client_id", "70f226d66e071f75cb43a3f68f012f1d")); // REST API KEY
        postParams.add(new BasicNameValuePair("redirect_uri", "http://localhost:8080/kakao/callback")); // 리다이렉트 URI
        postParams.add(new BasicNameValuePair("code", code)); // 로그인 과정중 얻은 code 값

        final HttpClient client = HttpClientBuilder.create().build();
        final HttpPost post = new HttpPost(RequestUrl);

        JsonNode returnNode = null;

        try {
            post.setEntity(new UrlEncodedFormEntity(postParams));

            final HttpResponse response = client.execute(post);
            final int responseCode = response.getStatusLine().getStatusCode();

            System.out.println("\nSending 'POST' request to URL : " + RequestUrl);
            System.out.println("Post parameters : " + postParams);
            System.out.println("Response Code : " + responseCode);

            // JSON 형태 반환값 처리
            ObjectMapper mapper = new ObjectMapper();

            returnNode = mapper.readTree(response.getEntity().getContent());

        } catch (IOException e) {
            e.printStackTrace();
        }

        return returnNode;
    }
}
