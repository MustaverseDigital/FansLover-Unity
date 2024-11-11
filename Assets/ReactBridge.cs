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
        //For react call 
        public void sendAddress(string address) 
        {
            controller.SetUserID(address);
        }
        
    }
}