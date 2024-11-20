using Naninovel;
using UnityEngine;
using UnityEngine.UI;

public class CatchEventHandler : MonoBehaviour
{
    private AIGFController _aigfController;
    [SerializeField] private Scrollbar scrollbarUI;
    [SerializeField] private GameObject cardCanvas;
    
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

        if (obj.Name.Equals("reward"))
        {
            cardCanvas.SetActive(obj.Value == "1");
        }
    }

    private void AddAiTinaReply(string playerReplyMessage)
    {
        scrollbarUI.gameObject.SetActive(true);
        _aigfController.SendMessageToApi(playerReplyMessage , ResponseCallback);
    }

    private void ResponseCallback(AIGFController.APIResponse obj)
    {
        Engine.GetService<CustomVariableManager>()
            .SetVariableValue("LLM", $"{obj.text}");
        if (obj.unlocked)
        {
            Engine.GetService<CustomVariableManager>()
                .SetVariableValue("loadingStoryID", "1");
        }
        Engine.GetService<CustomVariableManager>()
            .SetVariableValue("loveValue", $"{obj.love}");
        // ReSharper disable once PossibleLossOfFraction
        scrollbarUI.size = (float) obj.love / 100;
    }
}