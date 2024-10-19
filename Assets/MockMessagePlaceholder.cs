using System;
using System.Collections.Generic;
using Naninovel;
using UnityEngine;

public class MockMessagePlaceholder : MonoBehaviour
{
    private TextChatWindow chatWindow;
    private int _relyIndexMock = 0;
    
    private List<string> replyMessageLoopMock = new List<string>
    {
        "Is anything I can help?",
        "Relay mock message by LLM",
        "Placeholder mock message by LLM",
    };

    private void Start()
    {
        chatWindow = FindObjectOfType<TextChatWindow>();
        chatWindow.PlayerSendMessageEvent += PlayerSendMessageEvent;
    }

    private void PlayerSendMessageEvent(string message)
    {
        var nextMessage = replyMessageLoopMock[_relyIndexMock];
        chatWindow.AddOpponentMessage(nextMessage);
        _relyIndexMock++;
        if (_relyIndexMock == replyMessageLoopMock.Count)
        {
            var scriptPlayer = Engine.GetService<IScriptPlayer>();
            _ = scriptPlayer.PreloadAndPlayAsync("StudentStory");
            _relyIndexMock = 0;
            chatWindow.transform.root.gameObject.SetActive(false);
        }
    }
    
}