// Jenkinsfile (FINAL VERSION)

pipeline {
    // Agent section jo Docker aur kubectl tools ke saath ek pod banayega
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:3327.v868139a_d00e0-7
    args: ['$(JENKINS_SECRET)', '$(JENKINS_NAME)']
    resources:
      limits:
        memory: "1Gi"
        cpu: "1"
      requests:
        memory: "512Mi"
        cpu: "500m"
  - name: docker
    image: docker:20.10.7
    command: ['sleep']
    args: ['99d']
    tty: true
    volumeMounts:
      - name: docker-sock
        mountPath: /var/run/docker.sock
  - name: kubectl
    image: bitnami/kubectl:1.28
    command: ['sleep']
    args: ['99d']
    tty: true
  volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
'''
        }
    }

    // Aapki details ke saath updated environment block
    environment {
        DOCKER_HUB_USERNAME  = 'vaibhavsingh2910'
        BACKEND_IMAGE_NAME   = 'my-cool-app'
        FRONTEND_IMAGE_NAME  = 'my-frontend-app'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Agent pehle se hi code checkout kar leta hai
                echo 'Code checked out successfully.'
            }
        }

        stage('Build & Push Images') {
            steps {
                // 'docker' container ko istemal karne ke liye
                container('docker') {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                            sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                            
                            def backendImage = "${env.DOCKER_HUB_USERNAME}/${env.BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                            sh "docker build -t ${backendImage} ./backend"
                            sh "docker push ${backendImage}"
                            
                            def frontendImage = "${env.DOCKER_HUB_USERNAME}/${env.FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                            sh "docker build -t ${frontendImage} ./frontend"
                            sh "docker push ${frontendImage}"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // 'kubectl' container ko istemal karne ke liye
                container('kubectl') {
                    script {
                        def backendImage = "${env.DOCKER_HUB_USERNAME}/${env.BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        def frontendImage = "${env.DOCKER_HUB_USERNAME}/${env.FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                        
                        sh "kubectl set image deployment/backend-deployment backend-app=${backendImage}"
                        sh "kubectl set image deployment/frontend-deployment frontend-app=${frontendImage}"
                        
                        sh "kubectl rollout status deployment/backend-deployment"
                        sh "kubectl rollout status deployment/frontend-deployment"
                    }
                }
            }
        }
    }
    
    post {
        always {
            // 'docker' container ke andar logout command chalayein
            container('docker') {
                echo 'Pipeline finished. Logging out from Docker Hub...'
                sh 'docker logout'
            }
        }
    }
}
