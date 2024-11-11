using System;
using System.Runtime.InteropServices;
using UnityEngine;

namespace DefaultNamespace
{
    public class ReactBridge : MonoBehaviour
    {
        private AIGFController controller;

        private void Awake()
        {
            controller = FindObjectOfType<AIGFController>();
        }

        public void SandAddress(string address) 
        {
            controller.SetUserID(address);
        }
        
    }
}