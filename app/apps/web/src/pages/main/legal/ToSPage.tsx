import { motion } from "framer-motion"
import { FileText, Scale, AlertTriangle, Shield, Users, CreditCard, Gavel, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const termsSections = [
  {
    icon: Users,
    title: "Acceptance of Terms",
    content: [
      "By accessing and using our services, you accept and agree to be bound by these Terms of Service",
      "If you do not agree to these terms, you may not access or use our services",
      "We reserve the right to modify these terms at any time",
      "Continued use of our services after changes constitutes acceptance of the new terms",
      "You are responsible for reviewing these terms periodically"
    ]
  },
  {
    icon: Shield,
    title: "User Accounts",
    content: [
      "You must provide accurate and complete information when creating an account",
      "You are responsible for maintaining the security of your account credentials",
      "You must notify us immediately of any unauthorized use of your account",
      "We reserve the right to suspend or terminate accounts that violate these terms",
      "One person or entity may not maintain multiple accounts"
    ]
  },
  {
    icon: CreditCard,
    title: "Payment and Billing",
    content: [
      "Subscription fees are billed in advance on a recurring basis",
      "All fees are non-refundable except as required by law",
      "You may cancel your subscription at any time from your account settings",
      "We reserve the right to change our pricing with 30 days notice",
      "Payment disputes must be reported within 30 days of the charge"
    ]
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Uses",
    content: [
      "You may not use our services for any unlawful purpose",
      "You may not attempt to gain unauthorized access to our systems",
      "You may not interfere with or disrupt our services",
      "You may not use our services to transmit harmful or malicious code",
      "You may not violate any applicable laws or regulations"
    ]
  },
  {
    icon: Scale,
    title: "Intellectual Property",
    content: [
      "Our services and content are protected by intellectual property laws",
      "You retain ownership of content you create using our services",
      "You grant us a license to use your content to provide our services",
      "You may not copy, modify, or distribute our proprietary content",
      "We respect the intellectual property rights of others"
    ]
  },
  {
    icon: Gavel,
    title: "Limitation of Liability",
    content: [
      "Our services are provided 'as is' without warranties of any kind",
      "We are not liable for any indirect, incidental, or consequential damages",
      "Our total liability is limited to the amount you paid for our services",
      "Some jurisdictions do not allow limitation of liability",
      "These limitations apply to the fullest extent permitted by law"
    ]
  }
]

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <FileText className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            These terms govern your use of our services. Please read them carefully 
            before using our platform.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Last updated: January 15, 2024
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding agreement between you 
                and YourApp ("we," "us," or "our") regarding your use of our website and services. 
                By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you are entering into these Terms on behalf of a company or other legal entity, 
                you represent that you have the authority to bind such entity to these Terms. 
                If you do not have such authority, you must not accept these Terms.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      Important Notice
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      These terms contain important information about your rights and obligations. 
                      Please read them carefully and contact us if you have any questions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms Sections */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {termsSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <section.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Terms */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Additional Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Termination</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Either party may terminate this agreement at any time. Upon termination, 
                  your right to use our services will cease immediately. We may terminate 
                  or suspend your account if you violate these Terms.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Governing Law</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws 
                  of the State of California, without regard to its conflict of law provisions. 
                  Any disputes arising from these Terms will be resolved in the courts of California.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Severability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If any provision of these Terms is held to be invalid or unenforceable, 
                  the remaining provisions will remain in full force and effect. We will 
                  replace any invalid provision with a valid provision that most closely 
                  approximates the intent of the original provision.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Entire Agreement</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms, together with our Privacy Policy, constitute the entire 
                  agreement between you and us regarding the use of our services and 
                  supersede all prior agreements and understandings.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="bg-muted/50 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions about these Terms of Service, please contact our 
            legal team for clarification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              Contact Legal Team
            </Button>
            <Button variant="outline">
              Download Terms
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
