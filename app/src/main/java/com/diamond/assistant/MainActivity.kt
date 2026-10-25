package com.diamond.assistant

import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.util.Locale

class MainActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = null
    private lateinit var statusText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        statusText = TextView(this).apply {
            textSize = 20f
            setPadding(40, 40, 40, 40)
        }
        val talkButton = Button(this).apply {
            text = "Say hello to Diamond"
            setOnClickListener { greet() }
        }
        val stopButton = Button(this).apply {
            text = "Stop"
            setOnClickListener { stopSpeaking() }
        }

        setContentView(LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(40, 120, 40, 40)
            addView(statusText)
            addView(talkButton)
            addView(stopButton)
        })

        tts = TextToSpeech(this, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale.US
            greet()
        } else {
            statusText.text = "Voice engine failed to start"
        }
    }

    private fun greet() {
        val message = "Hello sir, I am Diamond. What do you want me to do for you today?"
        statusText.text = message
        tts?.speak(message, TextToSpeech.QUEUE_FLUSH, null, "greeting")
    }

    private fun stopSpeaking() {
        tts?.stop()
        statusText.text = "Diamond is quiet."
    }

    override fun onDestroy() {
        tts?.shutdown()
        super.onDestroy()
    }
}
