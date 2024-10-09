using System;
using Naninovel;
using UnityEngine;

public class CatchEventHandler : MonoBehaviour
{
    private void Start()
    {
        var variableManager = Engine.GetService<CustomVariableManager>();
        variableManager.OnVariableUpdated += OnVariableUpdated;
    }

    private void OnVariableUpdated(CustomVariableUpdatedArgs obj)
    {
        Debug.Log($"{obj.Name} {obj.Value} {obj.InitialValue}");
    }
}
