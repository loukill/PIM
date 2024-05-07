import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Main = () => {
    const navigation = useNavigation();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

        const handleInput = async () => {
            try {
                const response = await axios.post(
                    'https://api.openai.com/v1/engines/davinci/completions',
                    {
                        prompt: input,
                        max_tokens: 150,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'API KEY',
                        },
                    }
                );
                const outputData = response.data.choices[0].text.trim();
                setOutput(outputData);
            } catch (error) {
               
               
                setError("Error: Unable to fetch response");
                console.log("Error calling OpenAI API:", error);
            }
            setInput('');
        };

    const handleChatIconPress = () => {
        navigation.navigate('Chatbot');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chatbot</Text>
            <Image
                source={require('./assets/chatbot_8943377.png')}
                style={styles.image}
            />
            <View style={styles.chatContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message here"
                        onChangeText={(text) => setInput(text)}
                        value={input}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleInput}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.outputContainer}>
                    {error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.output}>{output}</Text>}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#52677e',
    },
    image: {
        width: 55,
        height: 55,
        marginBottom: 20,
    },
    chatContainer: {
        width: '90%',
        height: '70%',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#F2F5F9',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: '#FFFFFF',
        borderColor: '#CED4DA',
    },
    sendButton: {
        backgroundColor: '#3F88C5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    outputContainer: {
        flex: 1,
        padding: 20,
    },
    output: {
        fontSize: 16,
        color: '#555',
    },
    error: {
        fontSize: 16,
        color: 'red',
    },
});

export default Main;
