import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Animated, Text, View, StyleSheet, LayoutChangeEvent } from 'react-native'

export interface Props {
    text: string
    speed?: number
    width?: number
    inFontSize?: number
    inFontColor?: string
    isDisable?: boolean
    active?: boolean
    textAlign?: 'left' | 'center' | 'right'
    padding?: number
    disabledColor?: string
    activeColor?: string
}

const MarqueeText = (props: Props) => {
    const {
        text,
        speed = 30,
        width = 120,
        inFontSize = 10,
        inFontColor = '#000',
        isDisable = false,
        active = false,
        textAlign = 'center',
        padding = 30,
        disabledColor = 'rgba(12, 14, 29, .3)',
        activeColor = 'rgba(39, 123, 245, 1)',
    } = props

    const translateX = useRef(new Animated.Value(0)).current
    const animationRef = useRef<Animated.CompositeAnimation | null>(null)
    const [actualTextWidth, setActualTextWidth] = useState(0)
    const [containerWidth, setContainerWidth] = useState(width)
    const shouldAnimate = actualTextWidth > containerWidth

    // 清理动画
    const resetAnimation = useCallback(() => {
        translateX.setValue(0)
        animationRef.current?.stop()
        animationRef.current = null
    }, [translateX])

    // 启动滚动动画
    const startAnimation = useCallback(() => {
        if (!shouldAnimate) return
        const scrollDistance = (actualTextWidth  + padding) - containerWidth
        const duration = (actualTextWidth  + padding) * speed
        resetAnimation()
        translateX.setValue(0)

        animationRef.current = Animated.loop(
            Animated.timing(translateX, {
                toValue: -scrollDistance,
                duration: duration,
                useNativeDriver: true
            })
        )
        animationRef.current.start()
    }, [shouldAnimate, actualTextWidth, containerWidth, speed, translateX, resetAnimation])

    // 容器尺寸测量
    const handleContainerLayout = useCallback((e: LayoutChangeEvent) => {
        const newWidth = e.nativeEvent.layout.width
        setContainerWidth(newWidth)
    }, [])

    // 文本真实宽度测量（不受父容器限制）
    const handleTextMeasure = useCallback((e: LayoutChangeEvent) => {
        const measuredWidth = e.nativeEvent.layout.width
        setActualTextWidth(measuredWidth)
    }, [])

    // 响应 props 变化
    useEffect(() => {
        startAnimation()
        return () => resetAnimation()
    }, [shouldAnimate, startAnimation, resetAnimation])

    return (
        <>
            {/* 隐藏测量容器（用于获取实际文本宽度） */}
            <View style={styles.measureContainerStyle}>
                <Text
                    numberOfLines={1}
                    style={[styles.text, { fontSize: inFontSize }]}
                    onLayout={handleTextMeasure}
                >{text}</Text>
            </View>
            <View 
                style={[
                    styles.container, 
                    { width }
                ]} 
                onLayout={handleContainerLayout}
            >
                {/* 实际显示内容 */}
                {shouldAnimate ? (
                    <Animated.View style={{
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        transform: [{ translateX }],
                        width: actualTextWidth + padding,
                    }}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="clip"
                            style={[
                                styles.text,
                                {
                                    paddingHorizontal: padding / 2,
                                    fontSize: inFontSize,
                                    color: inFontColor,
                                },
                                isDisable ? { color: disabledColor} : active ? { color: activeColor} : null
                            ]}
                        >{text}</Text>
                    </Animated.View>
                ) : (
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.text,
                            {
                                fontSize: inFontSize,
                                color: inFontColor,
                                textAlign,
                            },
                            isDisable ? { color: disabledColor} : active ? { color: activeColor} : null
                        ]}
                    >{text}</Text>
                )}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        justifyContent:'center',
        minHeight: 20, // 防止测量容器高度塌陷
    },
    // 隐藏测量容器样式
    measureContainerStyle: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        position: 'absolute',
        opacity: 0,
        zIndex: -1,
        width: '10000%' // 确保测量容器可以无限扩展
    },
    text: {
        textAlignVertical: 'center',
        textAlign: 'left', // 滚动时强制左对齐
    },
})

export default MarqueeText