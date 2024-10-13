using System;
using Naninovel;
using UnityEngine;

public class CatchEventHandler : MonoBehaviour
{
    private int _replyTimes = 0;

    private void Start()
    {
        var variableManager = Engine.GetService<CustomVariableManager>();
        variableManager.OnVariableUpdated += OnVariableUpdated;
        variableManager.SetVariableValue("LLM", "This is AI Tina Replying");
    }

    private void OnVariableUpdated(CustomVariableUpdatedArgs obj)
    {
        Debug.Log($"{obj.Name} {obj.Value} {obj.InitialValue}");
        if (obj.Name.Equals("PlayerReply"))
        {
            AddAiTinaReply();
        }
    }

    private void AddAiTinaReply()
    {
        _replyTimes++;
        if (_replyTimes > 2)
        {
            Engine.GetService<CustomVariableManager>()
                .SetVariableValue("loadingStoryID", "1");
        }

        Engine.GetService<CustomVariableManager>()
            .SetVariableValue("LLM", $"This is AI Tina Replying {_replyTimes}");
    }
}