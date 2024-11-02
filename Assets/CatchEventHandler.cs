using System;
using Naninovel;
using UnityEngine;

public class CatchEventHandler : MonoBehaviour
{
    private int _replyTimes = 0;
    private AIGFController _aigfController;

    private void Start()
    {
        _aigfController = GetComponent<AIGFController>();
        var variableManager = Engine.GetService<CustomVariableManager>();
        variableManager.SetVariableValue("LLM", "This is AI Tina Replying");
        variableManager.OnVariableUpdated += OnVariableUpdated;
    }

    private void OnVariableUpdated(CustomVariableUpdatedArgs obj)
    {
        Debug.Log($"{obj.Name} {obj.Value} {obj.InitialValue}");
        if (obj.Name.Equals("PlayerReply"))
        {
            AddAiTinaReply(obj.Value);
        }
    }

    private void AddAiTinaReply(string playerReplyMessage)
    {
        _replyTimes++;
        if (_replyTimes > 2)
        {
            Engine.GetService<CustomVariableManager>()
                .SetVariableValue("loadingStoryID", "1");
        }
        _aigfController.SendMessageToApi(playerReplyMessage , ResponseCallback);
        
    }

    private void ResponseCallback(AIGFController.APIResponse obj)
    {
        Engine.GetService<CustomVariableManager>()
            .SetVariableValue("LLM", $"{obj.text}");
    }
}