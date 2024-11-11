using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Naninovel;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using Random = UnityEngine.Random;

public class AIGFController : MonoBehaviour
{
    [SerializeField] private string url = "https://ai-gf.tinalee.bot/chat";
    [SerializeField] private string userId = "Unknow";
    [SerializeField] private Text debugUI;

    public void SetUserID(string userAddress)
    {
        userId = userAddress;
        debugUI.text = userId;
    }

    // 呼叫 API 的方法
    public void SendMessageToApi(string message, Action<APIResponse> responseCallback)
    {
        StartCoroutine(SendRequestCoroutine(message, responseCallback));
    }

    IEnumerator SendRequestCoroutine(string message, Action<APIResponse> responseCallback = null)
    {
        // 建立請求
        UnityWebRequest request = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes($"{{\"message\": \"{message}\", \"userId\": {userId}}}");
        request.uploadHandler = (UploadHandler)new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        // 發送請求
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            // 解析 JSON
            APIResponse response = JsonUtility.FromJson<APIResponse>(request.downloadHandler.text);

            responseCallback?.Invoke(response);

            // 更新 UI 或進行其他處理
            Debug.Log("API 回應: " + JsonUtility.ToJson(response));
            Engine.GetService<CustomVariableManager>()
                .SetVariableValue("LLMResponse", "1");
        }
        else
        {
            Debug.LogError("API 請求失敗: " + request.error);
            Engine.GetService<CustomVariableManager>()
                .SetVariableValue("LLM", $"Tina 壞掉惹(\u260d﹏\u2070) {request.error}");
            Engine.GetService<CustomVariableManager>()
                .SetVariableValue("LLMResponse", "1");
        }
    }

    [Serializable]
    public class APIResponse
    {
        public string text;
        public int love;
        public bool unlocked;
    }
}